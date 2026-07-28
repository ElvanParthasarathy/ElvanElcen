using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace Nammil_Installer.Pages
{
    public sealed partial class WelcomePage : Page
    {
        public WelcomePage()
        {
            this.InitializeComponent();
        }

        private void Next_Click(object sender, RoutedEventArgs e)
        {
            MainWindow.Current.Navigate(typeof(LocationPage));
        }

        private void Cancel_Click(object sender, RoutedEventArgs e)
        {
            Application.Current.Exit();
        }
    }
}
