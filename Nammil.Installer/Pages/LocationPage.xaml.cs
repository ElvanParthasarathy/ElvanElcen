using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using System;
using System.IO;

namespace Nammil_Installer.Pages
{
    public sealed partial class LocationPage : Page
    {
        public static string SelectedAppPath { get; private set; } = @"C:\Program Files\Elvan Nammil";
        public static string SelectedMediaPath { get; private set; }

        public LocationPage()
        {
            this.InitializeComponent();
            string docs = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
            SelectedMediaPath = Path.Combine(docs, "Elvan Nammil", "Media");
            MediaPathBox.Text = SelectedMediaPath;
            AppPathBox.Text = SelectedAppPath;
        }

        private void BrowseApp_Click(object sender, RoutedEventArgs e)
        {
            using (var dialog = new System.Windows.Forms.FolderBrowserDialog())
            {
                dialog.Description = "Select Installation Folder";
                dialog.UseDescriptionForTitle = true;
                if (dialog.ShowDialog() == System.Windows.Forms.DialogResult.OK)
                {
                    AppPathBox.Text = Path.Combine(dialog.SelectedPath, "Elvan Nammil");
                }
            }
        }

        private void BrowseMedia_Click(object sender, RoutedEventArgs e)
        {
            using (var dialog = new System.Windows.Forms.FolderBrowserDialog())
            {
                dialog.Description = "Select Media Folder";
                dialog.UseDescriptionForTitle = true;
                if (dialog.ShowDialog() == System.Windows.Forms.DialogResult.OK)
                {
                    MediaPathBox.Text = dialog.SelectedPath;
                }
            }
        }

        private void Back_Click(object sender, RoutedEventArgs e)
        {
            MainWindow.Current.Navigate(typeof(WelcomePage));
        }

        private void Next_Click(object sender, RoutedEventArgs e)
        {
            SelectedAppPath = AppPathBox.Text;
            SelectedMediaPath = MediaPathBox.Text;
            MainWindow.Current.Navigate(typeof(AccountPage));
        }
    }
}
