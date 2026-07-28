using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace Nammil_Installer.Pages
{
    public sealed partial class AccountPage : Page
    {
        public static string SelectedAccountName { get; private set; }

        public AccountPage()
        {
            this.InitializeComponent();
        }

        private void Back_Click(object sender, RoutedEventArgs e)
        {
            MainWindow.Current.Navigate(typeof(LocationPage));
        }

        private void Install_Click(object sender, RoutedEventArgs e)
        {
            SelectedAccountName = string.IsNullOrWhiteSpace(AccountNameBox.Text) ? "Personal" : AccountNameBox.Text.Trim();
            MainWindow.Current.Navigate(typeof(ProgressPage));
        }
    }
}
