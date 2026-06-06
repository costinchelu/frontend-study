interface EBookV2 {
  title: string;
  author: string;
  fileFormat: 'PDF' | 'MOBI' | 'EPUB';
  downloadUrl: string;
}

let book5: EBookV2 = { title: "The Time Machine", author: "H.G. Wells", fileFormat: "PDF", downloadUrl: "http://example.com" };
