using FileServer.DB;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;

namespace FileServer.Controllers
{
    public class FileController : Controller
    {
        ApplicationDbContext _context;
        public FileController(ApplicationDbContext context) {
            _context = context;
        }
        private Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
            {
                { ".png", "image/png" },
                { ".jpg", "image/jpeg" },
                { ".jpeg", "image/jpeg" },
                { ".gif", "image/gif" },
                // Добавьте другие MIME типы по мере необходимости
            };
        }
        private string GetContentType(string path)
        {
            try
            {
                var types = GetMimeTypes();
                var ext = Path.GetExtension(path).ToLowerInvariant();
                return types[ext];
            } catch { return "application/octet-stream"; }
        }

        [HttpGet]
        [Route("getImage")]
        public async Task<IActionResult> GetImage(string fileHash, int? width = null, int? height = null)
        {
            var file = _context.Files.Where(f => f.FileHash == fileHash).FirstOrDefault();
            if (file == null)
            {
                return BadRequest("file not found");
            }
            var imagePath = file.FilePath;

            if (!System.IO.File.Exists(imagePath))
            {
                return NotFound();
            }
            string contentType;
            try
            {
                // Определите MIME тип на основе расширения файла
                contentType = GetContentType(imagePath);
            } catch
            {
                return BadRequest();
            }
            if (!width.HasValue || !height.HasValue)
            {
                return File(System.IO.File.OpenRead(imagePath), contentType); // Возвращает изображение с соответствующим MIME типом
            }

            // Изменить размер изображения
            using (var image = Image.FromFile(imagePath))
            {
                var resizedImage = ResizeImage(image, width.Value, height.Value);
                MemoryStream ms = new MemoryStream();
                resizedImage.Save(ms, contentType.IndexOf("png") != -1 ? ImageFormat.Png : ImageFormat.Jpeg);
                
                return File(ms.ToArray(), contentType);
            }

        }
        public static Bitmap ResizeImage(Image image, int width, int height)
        {
            var destRect = new Rectangle(0, 0, width, height);
            var destImage = new Bitmap(width, height);
            destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);
            using (var graphics = Graphics.FromImage(destImage))
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
                using (var wrapMode = new ImageAttributes())
                {
                    wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                    graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
                }
            }
            return destImage;
        }

        [HttpGet]
        [Route("getFile")]
        public async Task<IActionResult> GetFile(string fileHash)
        {
            var file = _context.Files.Where(f => f.FileHash == fileHash).FirstOrDefault();
            if (file == null)
            {
                return BadRequest("file not found");
            }
            var filePath = file.FilePath;

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }


            var fileStream = System.IO.File.OpenRead(filePath);
            return File(fileStream, "application/octet-stream", file.Name);
        }
        [HttpGet]
        [Route("getFilesInfo")]
        public async Task<IActionResult> GetFileInfo([FromQuery] string[] filesHash)
        {
            var result = new List<object>();
            foreach (var hash in filesHash)
            {
                var file = _context.Files.Where(f => f.FileHash.Equals(hash)).First();
                result.Add(new
                {
                    fileName = file.Name,
                    fileSize = file.FileSize,
                    fileHash = file.FileHash
                });
            }
            return Ok(new
            {
                files = result
            });
        }

        [HttpPost]
        [Route("uploadFile")]
        public async Task<IActionResult> UploadFile()
        {
            List<string> filesHash = new List<string>();
            try
            {
                var files = Request.Form.Files;
                for (var i = 0; i < files.Count; i++)
                {
                    string hash = CalculateFileHash(files[i]);
                    filesHash.Add(hash);
                    if (_context.Files.Where(f => f.FileHash.Equals(hash)).FirstOrDefault() == null)
                    {
                         
                        var imagePath = Path.Combine("Files", files[i].FileName);
                        var dbFile = new Models.File()
                        {
                            Id = Guid.NewGuid().ToString(),
                            Name = files[i].FileName,
                            FilePath = imagePath,
                            FileType = GetContentType(files[i].FileName),
                            FileHash = hash,
                            FileSize = files[i].Length
                        };
                        _context.Files.Add(dbFile);
                        _context.SaveChanges();
                        using (var stream = new FileStream(imagePath, FileMode.Create))
                        {
                            files[i].CopyTo(stream);
                        }
                    }
                }
                

                return Ok(new
                {
                    filesHash
                });
            } catch (Exception ex)
            {
                return BadRequest("something went wrong");
            }
        }

        private string CalculateFileHash(IFormFile file)
        {
            using (var stream = file.OpenReadStream())
            {
                using (var sha256 = SHA256.Create())
                {
                    byte[] hashBytes = sha256.ComputeHash(stream);
                    return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
                }
            }
        }
    }
}
