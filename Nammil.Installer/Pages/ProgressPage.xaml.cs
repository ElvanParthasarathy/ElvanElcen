using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using System.Threading.Tasks;
using Nammil_Installer.Services;
using System;

namespace Nammil_Installer.Pages
{
    public sealed partial class ProgressPage : Page
    {
        public ProgressPage()
        {
            this.InitializeComponent();
            this.Loaded += ProgressPage_Loaded;
        }

        private async void ProgressPage_Loaded(object sender, RoutedEventArgs e)
        {
            try
            {
                await InstallEngine.InstallAsync(
                    LocationPage.SelectedAppPath,
                    LocationPage.SelectedMediaPath,
                    AccountPage.SelectedAccountName
                );
                
                StatusText.Text = "Installation complete!";
                InstallProgress.Visibility = Visibility.Collapsed;
                FinishedPanel.Visibility = Visibility.Visible;
            }
            catch (Exception ex)
            {
                StatusText.Text = "Error: " + ex.Message;
                InstallProgress.Visibility = Visibility.Collapsed;
            }
        }

        private void Finish_Click(object sender, RoutedEventArgs e)
        {
            InstallEngine.LaunchApp(LocationPage.SelectedAppPath);
            Application.Current.Exit();
        }
    }
}
