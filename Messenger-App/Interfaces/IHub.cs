namespace Messenger_App.Interfaces
{
    public interface IHub
    {
        Task SendMessage(string userId);
        Task OnConnectedAsync();
        Task OnDisconnectedAsync(Exception exception);
    }
}
