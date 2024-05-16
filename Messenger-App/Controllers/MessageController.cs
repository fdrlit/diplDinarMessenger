using Messenger_App.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Messenger_App.Middleware;
using Messenger_App.ApiModels;
using Microsoft.AspNetCore.Authorization;
using Messenger_App.DB;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System.Security.Cryptography;
using System.Text;
using Messenger_App.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using System.Net;
using System.Reflection;
using Newtonsoft.Json;
using System.Net.Http;

namespace Messenger_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private static string iAmToken;
        private readonly IHubContext<SignalrHub> _hub;
        private static DateTime tokenExpireDate;
        private static HttpClient _httpClient;
        public MessageController(
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context,
            IConfiguration configuration,
            IHubContext<SignalrHub> hub,
            HttpClient httpClient

            )
        {
            _userManager = userManager;
            _configuration = configuration;
            _context = context;
            _hub = hub;
            _httpClient = httpClient;
        }


        [Authorize]
        [HttpGet]
        [Route("user-conversations-with-last-message")]
        public async Task<IActionResult> SendConversationsWithLastMessage()
        {
            var userId = User.FindFirst("Id")?.Value;
            var encryptionKey = _configuration.GetValue<string>("Encryption:SymmetricKey");


            var userIds = _context.Messages
                                    .Where(m => m.Sender.Id == userId || m.RecipientId == userId)
                                    .OrderByDescending(m => m.CreateDate)
                                    .GroupBy(m => m.Sender.Id == userId ? m.RecipientId : m.Sender.Id)
                                    .Select(g => new
                                    {
                                        UserId = g.Key
                                    }).ToList();
            var deletedMesages = _context.DeletedMessages
                                    .Where(d => d.User.Id == userId)
                                    .Select(d => new
                                    {
                                        DeletedMessage = d.Message
                                    });
            var userConversations = userIds
                                    .Select(u_ids => new
                                    {
                                        u_ids.UserId,
                                        Self = u_ids.UserId == userId,
                                        FirstName = _context.Users.Where(u => u.Id == u_ids.UserId).FirstOrDefault().FirstName,
                                        LastName = _context.Users.Where(u => u.Id == u_ids.UserId).FirstOrDefault().LastName,
                                        UserName = _context.Users.Where(u => u.Id == u_ids.UserId).FirstOrDefault().UserName,
                                        isOnline = _context.Users.Where(u => u.Id == u_ids.UserId).FirstOrDefault().IsOnline, 
                                        AvatarUrl = _context.Users.Where(u => u.Id == u_ids.UserId).FirstOrDefault().Avatars != null ?
                                                    _context.Users.Where(u => u.Id == u_ids.UserId).FirstOrDefault().Avatars[_context.Users.Where(u => u.Id == u_ids.UserId).FirstOrDefault().Avatars.Count - 1] : null,
                                        LastMessage = _context.Messages
                                                            .Where(m_grouped => ((m_grouped.RecipientId == u_ids.UserId && m_grouped.Sender.Id == userId) || 
                                                                (m_grouped.RecipientId == userId && m_grouped.Sender.Id == u_ids.UserId)) &&
                                                                (!_context.DeletedMessages.Any(d => d.Message.Id == m_grouped.Id && d.User.Id == userId)))
                                                            .OrderByDescending(m => m.CreateDate)
                                                            .Select(m => new
                                                            {
                                                                Text = Crypt.Decrypt(m.EncryptedText, encryptionKey),
                                                                CreateDate = m.CreateDate
                                                            })
                                                            .FirstOrDefault(),
                                        UnreadCount = _context.Messages
                                                            .Where(m_grouped => (m_grouped.RecipientId == userId && m_grouped.Sender.Id == u_ids.UserId && m_grouped.ReadStatus == false) &&
                                                                (!_context.DeletedMessages.Any(d => d.Message.Id == m_grouped.Id && d.User.Id == userId)))
                                                            .ToList().Count
                                    }).ToList();
            userConversations = userConversations.OrderByDescending(m => m.LastMessage.CreateDate).ToList();



            string jsonResult = Newtonsoft.Json.JsonConvert.SerializeObject(userConversations);
            return Ok(jsonResult);
        }
        [Authorize]
        [HttpGet]
        [Route("lastOnlineDate")]
        public async Task<IActionResult> ReceiveLastOnlineDate(string userId)
        {
            var currentUserId = User.FindFirst("Id")?.Value;
            var user = _context.Users.Where(u => u.Id == userId).FirstOrDefault();
            if (user == null)
            {
                return BadRequest("user not found");
            }
            var result = new
            {
                isOnline = user.IsOnline,
                lastOnlineDate = user.lastOnlineDate,
                userName = user.UserName,
                firstName = user.FirstName,
                lastName = user.LastName,
                self = userId == currentUserId
            };
            string jsonResult = Newtonsoft.Json.JsonConvert.SerializeObject(result);
            return Ok(jsonResult);
        }
        [Authorize]
        [HttpPost]
        [Route("deleteMessageForMe")]
        public async Task<IActionResult> DeleteMessageForMe([FromBody] DeleteMessageModel model)
        {
            if (!ModelState.IsValid) { return BadRequest(); }
            var userId = User.FindFirst("Id")?.Value;
            var user = _context.Users.Where(u => u.Id == userId).FirstOrDefault();
            if (user == null)
            {
                return Unauthorized();
            }
            var message = _context.Messages.Where(m => m.Id == model.MessageId && (m.RecipientId == userId || m.Sender.Id == userId)).FirstOrDefault();
            if (message == null)
            {
                return BadRequest("message not found");
            }
            var deletedMessageExist = _context.DeletedMessages.Where(d => d.Message.Id == message.Id && d.User.Id == userId).FirstOrDefault();
            if (deletedMessageExist != null) { return Ok(); }
            var lastDeletedMessages = _context.DeletedMessages.OrderByDescending(d => d.CreateDate).FirstOrDefault();
            string maxId;
            if (lastDeletedMessages == null)
            {
                maxId = "0";
            }
            else maxId = lastDeletedMessages.Id;
            
            DeletedMessages deletedMessage = new DeletedMessages()
            {
                Id = (long.Parse(maxId) + 1).ToString(),
                User = user,
                Message = message,
                CreateDate = DateTime.UtcNow
            };
            await _context.DeletedMessages.AddAsync(deletedMessage);
            await _context.SaveChangesAsync();
            return Ok();
        }
        [Authorize]
        [HttpPost]
        [Route("deleteMessageForAll")]
        public async Task<IActionResult> DeleteMessageForAll([FromBody] DeleteMessageModel model)
        {
            var userId = User.FindFirst("Id")?.Value;
            var message = _context.Messages.Where(m => m.Id == model.MessageId && (m.RecipientId == userId || m.Sender.Id == userId)).FirstOrDefault();
            if (message == null)
            {
                return BadRequest("message not found");
            }
            var messagesToUpdate = await _context.Messages.Where(m => m.ReplyMessageId == model.MessageId).ToListAsync();

            foreach (Message msg in messagesToUpdate)
            {
                msg.ReplyMessageId = null;
            }
            var messageSender = _context.Messages.Where(m => m.Id == model.MessageId).Select(m => new
            {
                RecipientId = m.RecipientId,
                SenderId = m.Sender.Id
            }).First();
            var connectionId = SignalrHub.GetConnectionId(messageSender.SenderId == userId ? messageSender.RecipientId : messageSender.SenderId);
            if (connectionId != null)
            {
                await _hub.Clients.Client(connectionId).SendAsync("updateMessages", userId);
            }
            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();
            return Ok();

        }
        [Authorize]
        [HttpGet]
        [Route("getMessageData")]
        public async Task<IActionResult> DeleteMessageForAll(string messageId)
        {
            var userId = User.FindFirst("Id")?.Value;
            var user = _context.Users.Where(u => u.Id == userId).FirstOrDefault();
            var encryptionKey = _configuration.GetValue<string>("Encryption:SymmetricKey");
            var msg = await _context.Messages
                                .Where(m => (m.Sender.Id == userId || m.RecipientId == userId) && m.Id == messageId)
                                .Select(m => new
                                {
                                    senderUsername = m.Sender.UserName,
                                    messageData = Crypt.Decrypt(m.EncryptedText, encryptionKey)
                                }).ToListAsync();
            if (msg.Count == 0) { return BadRequest("message data not found"); }
            return Ok(JsonConvert.SerializeObject(msg[0]));

        }
        [Authorize]
        [HttpGet]
        [Route("receiveMessages")]
        public async Task<IActionResult> ReceiveMessages(string groupOrUserId, int offset, int takeCount)
        {
            var userId = User.FindFirst("Id")?.Value;
            var userName = userId == groupOrUserId ? "Избранное" : _context.Users.Where(u => u.Id == groupOrUserId).FirstOrDefault().UserName;
            var encryptionKey = _configuration.GetValue<string>("Encryption:SymmetricKey");
            //int totalCount = await _context.Messages
            //                        .Where(m => (m.RecipientId == groupOrUserId && m.Sender.Id == userId) || (m.RecipientId == userId && m.Sender.Id == groupOrUserId))
            //                        .CountAsync();
            //int offsetCount = (offset > totalCount) ? (Math.Max(totalCount - take, 0)) : offset
            var updateMessagesStatus = await _context.Messages
                                        .Where(m => m.RecipientId == userId && m.Sender.Id == groupOrUserId && m.ReadStatus == false)
                                        .ToListAsync();
            var readMessages = new List<object>(); 
            
            var messages = await _context.Messages
                                    .Where(m => ((m.RecipientId == groupOrUserId && m.Sender.Id == userId) || 
                                                (m.RecipientId == userId && m.Sender.Id == groupOrUserId)) &&
                                                (!_context.DeletedMessages.Any(d => d.Message.Id == m.Id && (d.User.Id == userId))))
                                    .OrderByDescending(m => m.CreateDate)
                                    
                                    //.Skip(offsetCount)
                                    //.Take(take)
                                    .Select(m => new
                                    {
                                        m.Id,
                                        UserName = userName,
                                        Text = Crypt.Decrypt(m.EncryptedText, encryptionKey),
                                        m.CreateDate,
                                        SenderId = m.Sender.Id,
                                        SentByUser = m.Sender.Id == userId,
                                        Files = m.Files.Any() ? _context.Files.Where(f => m.Files.IndexOf(f.FileHash) != -1).Select(f => new
                                        {
                                            hash = f.FileHash,
                                            fileName = f.Name,
                                            fileSize = f.FileSize,
                                        }).ToList() : null,
                                        ReplyMessage =  _context.Messages.Where(rM => rM.Id == m.ReplyMessageId).Select(rM => new
                                        {
                                            MessageId = rM.Id,
                                            UserName = rM.Sender.UserName,
                                            MessageData = Crypt.Decrypt(rM.EncryptedText, encryptionKey)
                                        }).ToList(),
                                        m.ReadStatus
                                    })
                                    .Skip(offset)
                                    .Take(takeCount)
                                    .ToListAsync();
            //messages.Reverse();
            var result = Newtonsoft.Json.JsonConvert.SerializeObject(new
            {
                UserName = userName,
                Messages = messages,
                Self = userId == groupOrUserId
            });
            foreach (var msg in updateMessagesStatus)
            {
                readMessages.Add(new
                {
                    Id = msg.Id
                });
                msg.ReadStatus = true;
            }

            await _context.SaveChangesAsync();

            if (updateMessagesStatus.Count != 0)
            {
                var connectionId = SignalrHub.GetConnectionId(groupOrUserId);
                if (connectionId != null)
                {
                    await _hub.Clients.Client(connectionId).SendAsync("changeReadStatus", userId, JsonConvert.SerializeObject(readMessages));
                }
            }
            return Ok(result);
        }

        [Authorize]
        [HttpPost]
        [Route("send")]
        public async Task<IActionResult> SendMessage([FromForm] MessageRequestModel model, List<IFormFile> files)
        {
            var userId = User.FindFirst("Id")?.Value;
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            if (model.RecipientType != "User" && model.RecipientType != "Group")
                return BadRequest("incorrect recipientType");

            if (model.ReplyMessageId != "undefined" && model.ReplyMessageId != null && model.ReplyMessageId != "null")
            {
                if (_context.Messages.Where(m => m.Id == model.ReplyMessageId).FirstOrDefault() == null)
                    return BadRequest("replyMessage not found");
            }
            if (model.RecipientType == "User")
            {
                if (await _userManager.FindByIdAsync(model.RecipientId) == null)
                    return BadRequest("incorrect recipient");
            }
            else
            {
                var groupCount = _context.Groups.Where(g => g.Id == model.RecipientId).ToList().Count;
                if (groupCount == 0) { return BadRequest("incorrect recipient"); }
            }
            List<string> filesHash = null;
            if (files != null && files.Count > 0)
            {
                var fileServerUrl = "https://localhost:7253/uploadFile";
                using (var formData = new MultipartFormDataContent())
                {
                    for (var i = 0; i < files.Count; i++)
                    {
                        var stream = files[i].OpenReadStream(); // Removed the using statement here
                        formData.Add(new StreamContent(stream), files[i].FileName, files[i].FileName);
                    }

                    // Отправляем запрос на другой сервер
                    var response = await _httpClient.PostAsync(fileServerUrl, formData);

                    // Проверяем успешность запроса
                    response.EnsureSuccessStatusCode();

                    string responseString = await response.Content.ReadAsStringAsync();

                    // Преобразование строки JSON в объект
                    var responseObject = JsonConvert.DeserializeObject<Dictionary<string, List<string>>>(responseString);

                    if (responseObject.ContainsKey("filesHash"))
                    {
                        filesHash = responseObject["filesHash"];
                    }
                }
            }

            var encryptionKey = _configuration.GetValue<string>("Encryption:SymmetricKey");
            var sender = await _userManager.FindByIdAsync(userId);
            var lastMsg = _context.Messages.OrderByDescending(m => m.CreateDate).FirstOrDefault();
            string maxId;
            if (lastMsg == null)
            {
                maxId = "0";
            } else maxId = lastMsg.Id;
            string message;
            Message msg = new Message();
            List<string> result = new List<string>();
            for (int i = 0; i < model.Message.Length; i += 4000) {
                int length = Math.Min(4000, model.Message.Length - i);
                result.Add(model.Message.Substring(i, length));
            }
            List<object> messages = new List<object>();
            for (var i = 0; i < result.Count; i++)
            {
                message = result[i];
                message = Crypt.Encrypt(message, encryptionKey);
                msg = new Message()
                {
                    Id = (long.Parse(maxId) + 1 + i).ToString(),
                    RecipientId = model.RecipientId,
                    RecipientType = model.RecipientType,
                    EncryptedText = message,
                    CreateDate = DateTime.UtcNow,
                    ReplyMessageId = model.ReplyMessageId,
                    Sender = sender,
                    ReadStatus = false,
                    Files = filesHash
                };
                messages.Add(new
                {
                    msg.Id,
                    UserName = _context.Users.Where(u => u.Id == model.RecipientId).First().UserName,
                    Text = Crypt.Decrypt(msg.EncryptedText, encryptionKey),
                    msg.CreateDate,
                    SenderId = sender.Id,
                    SentByUser = false,
                    ReplyMessage = _context.Messages.Where(rM => rM.Id == msg.ReplyMessageId).Select(rM => new
                    {
                        MessageId = rM.Id,
                        UserName = rM.Sender.UserName,
                        MessageData = Crypt.Decrypt(rM.EncryptedText, encryptionKey)
                    }).ToList(),
                    msg.ReadStatus
                });
                await _context.Messages.AddAsync(msg);
                await _context.SaveChangesAsync();
            }
            var connectionId = SignalrHub.GetConnectionId(model.RecipientId);
            if (connectionId != null)
            {
                await _hub.Clients.Client(connectionId).SendAsync("updateMessages", userId, JsonConvert.SerializeObject(messages));
            }

            string jsonResult = Newtonsoft.Json.JsonConvert.SerializeObject(new
            {
                id = (long.Parse(maxId) + 1).ToString(),
                text = model.Message,
                createDate = msg.CreateDate,
                senderId = sender.Id

            });
            return Ok(jsonResult);
        }

        [Authorize]
        [HttpGet]
        [Route("search")]
        public async Task<IActionResult> Search(string searchText)
        {
            var userId = User.FindFirst("Id")?.Value;
            var users = _context.Users
                            .Where(u => u.UserName.ToLower().Contains(searchText.ToLower()))
                            .Select(u => new
                            {
                                u.Id,
                                UserName = (u.Id == userId ? "Избранное" : u.UserName)
                            }).ToList();

            var encryptionKey = _configuration.GetValue<string>("Encryption:SymmetricKey");
            var decryptedMessages = _context.Messages
                            .Where(m => m.Sender.Id == userId || m.RecipientId == userId)
                            .Select(m => new
                            {
                                m.Id,
                                UserId = m.Sender.Id == userId ? m.RecipientId : m.Sender.Id,
                                UserName = (m.Sender.Id == userId && m.RecipientId == userId) ? "Избранное" : m.Sender.Id == userId ? _context.Users.Where(u => u.Id == m.RecipientId).FirstOrDefault().UserName : m.Sender.UserName,
                                LastMessage = Crypt.Decrypt(m.EncryptedText, encryptionKey),
                                MessageDate = m.CreateDate
                            }).ToList();
            var messages = decryptedMessages
                            .Where(m => m.LastMessage.ToLower().Contains(searchText.ToLower()) &&
                            (!_context.DeletedMessages.Any(d => d.Message.Id == m.Id && (d.User.Id == userId))))
                            .OrderByDescending(m => m.MessageDate)
                            .Select(m => new
                            {
                                m.Id,
                                m.UserId,
                                m.UserName,
                                m.LastMessage,
                                m.MessageDate
                            });
            var result = new
            {
                Users = users,
                Messages = messages
            };
            var jsonResult = JsonConvert.SerializeObject(result);
            return Ok(jsonResult);
        }

        [Authorize]
        [HttpGet]
        [Route("translate-message")]
        public async Task<IActionResult> ReceiveTranslation(string messageId, string targetLanguageCode)
        {
            var userId = User.FindFirst("Id")?.Value;
            var message = _context.Messages.Where(m => m.Id == messageId && (m.Sender.Id == userId || m.RecipientId == userId)).First();
            if (message == null)
                return BadRequest("message not found");

            var encryptionKey = _configuration.GetValue<string>("Encryption:SymmetricKey");
            var messageText = Crypt.Decrypt(message.EncryptedText, encryptionKey);
            if (tokenExpireDate < DateTime.Now)
            {
                using (HttpClient client = new HttpClient())
                {
                    string OAuthToken = _configuration.GetValue<string>("YandexApi:OAuthToken");
                    string jsonData = "{\"yandexPassportOauthToken\": \"" + OAuthToken + "\"}";
                    
                    var content = new StringContent(jsonData, Encoding.UTF8, "application/json");

                    HttpResponseMessage response = await client.PostAsync("https://iam.api.cloud.yandex.net/iam/v1/tokens", content);
                    if (response.IsSuccessStatusCode)
                    {
                        string responseContent = await response.Content.ReadAsStringAsync();
                        var json = JsonDocument.Parse(responseContent);
                        var root = json.RootElement;

                        iAmToken = root.GetProperty("iamToken").GetString();

                        tokenExpireDate = DateTime.Parse(root.GetProperty("expiresAt").GetString());
                    }
                    else return StatusCode((int)HttpStatusCode.InternalServerError);
                }
            }
            
            using (HttpClient client = new HttpClient())
            {
                string OAuthToken = _configuration.GetValue<string>("YandexApi:OAuthToken");
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", iAmToken);

                string jsonData = "{\"folder_id\": \"b1gl3iue7056mfbeph4d\", \"texts\": [\"" + messageText + "\"], \"targetLanguageCode\": \"" + targetLanguageCode + "\"}";
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await client.PostAsync("https://translate.api.cloud.yandex.net/translate/v2/translate", content);
                if (response.IsSuccessStatusCode)
                {
                    string responseContent = await response.Content.ReadAsStringAsync();
                    var json = JsonDocument.Parse(responseContent);
                    var root = json.RootElement;

                    var translate = root.GetProperty("translations")[0].GetProperty("text").GetString();

                    return Ok(Newtonsoft.Json.JsonConvert.SerializeObject(new
                    {
                        translate

                    }));
                }
            }
            return StatusCode((int)HttpStatusCode.InternalServerError);

        } 
        [Authorize]
        [HttpPost]
        [Route("create-conversation")]
        public async Task<IActionResult> CreateConversation([FromBody] ParticipantRequestModel model)
        {
            //var receiver = await _userManager.FindByIdAsync(model.ReceiverId);
            //if (receiver == null) { return BadRequest("No receiver data"); }

            //var sender = await _userManager.FindByIdAsync(User.FindFirst("Id")?.Value);
            //var senderId = User.FindFirst("Id")?.Value;
            //var conversation = _context.Conversations
            //                          .Where(c => c.Users.Any(u => u.Id == senderId) && c.Users.Any(u => u.Id == model.ReceiverId) && c.Users.Count == 2)
            //                          .FirstOrDefault();
            //if (conversation == null)
            //{
            //    conversation = new Conversation()
            //    {
            //        Id = await GenerateNewIdAsync(_context.Conversations),
            //        CreateDate = DateTime.UtcNow,
            //        Users = new List<ApplicationUser> { sender, receiver }
            //    };
            //    await _context.Conversations.AddAsync(conversation);
            //    await _context.SaveChangesAsync();
            //}
            //return Ok(new { ConversationId = conversation.Id });
            return Ok();
        }

    }
}
