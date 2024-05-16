namespace Messenger_App.ApiModels
{
    public class MessageRequestModel
    {
        public string RecipientId { get; set; }
        public string? Message { get; set; }
        public string RecipientType { get; set; }
        public string? ReplyMessageId { get; set; }
    }
}
