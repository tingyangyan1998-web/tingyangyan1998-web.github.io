const legacyLookbookHash = /(?:^#|&)style=\d|(?:^#|&)scene=(?:meeting|lobby|presentation)/;

if (legacyLookbookHash.test(window.location.hash)) {
  window.location.replace(`lookbook.html${window.location.hash}`);
}
