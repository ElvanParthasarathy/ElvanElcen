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

        private async void BrowseApp_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var folderPicker = new Windows.Storage.Pickers.FolderPicker();
                folderPicker.SuggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.ComputerFolder;
                folderPicker.FileTypeFilter.Add("*");
                
                var hwnd = WinRT.Interop.WindowNative.GetWindowHandle(MainWindow.Current);
                WinRT.Interop.InitializeWithWindow.Initialize(folderPicker, hwnd);

                var folder = await folderPicker.PickSingleFolderAsync();
                if (folder != null)
                {
                    AppPathBox.Text = Path.Combine(folder.Path, "Elvan Nammil");
                }
            }
            catch
            {
                // Elevation prevents COM picker
                AppPathBox.Text = @"C:\Program Files\Elvan Nammil";
            }
        }

        private async void BrowseMedia_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var folderPicker = new Windows.Storage.Pickers.FolderPicker();
                folderPicker.SuggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.DocumentsLibrary;
                folderPicker.FileTypeFilter.Add("*");
                
                var hwnd = WinRT.Interop.WindowNative.GetWindowHandle(MainWindow.Current);
                WinRT.Interop.InitializeWithWindow.Initialize(folderPicker, hwnd);

                var folder = await folderPicker.PickSingleFolderAsync();
                if (folder != null)
                {
                    MediaPathBox.Text = folder.Path;
                }
            }
            catch
            {
                // Ignore crash
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
