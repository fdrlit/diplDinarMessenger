namespace Messenger_App.ApiModels
{
    public class PasswordRestoreModel
    {
        public string code {  get; set; }
        public string id { get; set; }
        public string newPassword { get; set; }
    }
}
