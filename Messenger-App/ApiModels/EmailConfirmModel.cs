namespace Messenger_App.ApiModels
{
    public class EmailConfirmModel
    {
        public string Email { get; set; }
        public string successCallbackUrl { get; set; } // /home
        public string errorCallbackUrl { get; set; }
    }
}
