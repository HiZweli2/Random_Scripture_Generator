document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('startButton').addEventListener('click', startReading);
    populateBooks();
    checkNotificationPermission();


    document.getElementById('versePopup').querySelector('button[onclick="markAsRead()"]').addEventListener('click', markAsRead);
    document.getElementById('versePopup').querySelector('button[onclick="postpone()"]').addEventListener('click', postpone);
});

function populateBooks() {
    const bookSelect = document.getElementById('book');
    const books = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", 
                   "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", 
                   "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", 
                   "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", 
                   "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", 
                   "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", 
                   "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", 
                   "Matthew", "Mark", "Luke", "John", "Acts", "Romans", 
                   "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", 
                   "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", 
                   "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", 
                   "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"];
    books.forEach(function(book) {
        let option = document.createElement('option');
        option.value = book;
        option.textContent = book;
        bookSelect.appendChild(option);
    });
}


//Store books and total chapters in a book
const bibleBooks = {
    "Genesis": 50, "Exodus": 40,"Leviticus": 27,
    "Numbers": 36,"Deuteronomy": 34,"Joshua": 24,
    "Judges": 21,"Ruth": 4,"1Samuel": 31,
    "2Samuel": 24,"1Kings": 22,"2Kings": 25,
    "1Chronicles": 29,"2Chronicles": 36,"Ezra": 10,
    "Nehemiah": 13,"Esther": 10,"Job": 42,
    "Psalms": 150,"Proverbs": 31,"Ecclesiastes": 12,
    "Song of Solomon": 8,"Isaiah": 66,"Jeremiah": 52,
    "Lamentations": 5,"Ezekiel": 48,"Daniel": 12,
    "Hosea": 14,"Joel": 3,"Amos": 9,
    "Obadiah": 1,"Jonah": 4,"Micah": 7,
    "Nahum": 3,"Habakkuk": 3,"Zephaniah": 3,
    "Haggai": 2,"Zechariah": 14,"Malachi": 4,
    "Matthew": 28,"Mark": 16,"Luke": 24,
    "John": 21,"Acts": 28,"Romans": 16,
    "1Corinthians": 16,"2Corinthians": 13,"Galatians": 6,
    "Ephesians": 6,"Philippians": 4,"Colossians": 4,
    "1Thessalonians": 5,"2Thessalonians": 3,"1Timothy": 6,
    "2Timothy": 4,"Titus": 3,"Philemon": 1,
    "Hebrews": 13,"James": 5,"1Peter": 5,
    "2Peter": 3,"1John": 5,"2John": 1,
    "3John": 1,"Jude": 1,"Revelation": 22
  };
  
  const selectedVerse = {
    "version": "en-kjv",
    "book":"",
    "chapter":"",
    "verse":"",
  };

//Get the version of the bible
  document.getElementById("translation").addEventListener('click',()=>{
   selectedVerse.version = document.getElementById("translation").value;
    console.log(document.getElementById("translation").value);
  });


//Get userinput about the book they want to read
document.getElementById("book").addEventListener('click',()=>{
    let chosenBook = document.getElementById("book").value;
    chosenBook = chosenBook.replace(/\s/g, '');
    selectedVerse.book = chosenBook;
    const maxChapters = bibleBooks[chosenBook];
    const randomChapter = Math.floor(Math.random() * maxChapters + 1) + 1;
    selectedVerse.chapter = randomChapter
    getVerses();
    
});

function checkNotificationPermission() {
    console.log(Notification.permission);
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Notification permission granted.");
            } else {
                console.log("Notification permission denied.");
            }
        });
    }else{
        console.log("Your permissions were " + Notification.permission)
    }
}


function startReading() {
    if ( document.getElementById("versePopup").classList.contains('hidden') ){
        document.getElementById("versePopup").classList.toggle('hidden');
    }
}

function markAsRead() {
    console.log('Reading marked as done.');
    const versePopup = document.getElementById('versePopup');
    console.log("removing currentScripture")
    try{
        let check = document.getElementById("currentScripture").remove();
    }catch(error){
        console.log("No scripture yet");
    }finally{
        console.log("No scripture yet")
    }
    
    versePopup.classList.add('hidden');
    
}

function postpone() {
    console.log('Reading postponed.');
    const versePopup = document.getElementById('versePopup');
    versePopup.classList.add('hidden');
}


function getVerses(){
    fetch(`https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/${selectedVerse.version}/books/${selectedVerse.book.toLowerCase()}/chapters/${selectedVerse.chapter}.json`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json'
          }
    }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then(data => {
        // Handle the JSON data received api
        const maxVerses = Object.keys(data).length;
        const randomVerse = Math.floor(Math.random() * maxVerses + 1) + 1;
        selectedVerse.verse = randomVerse;
        console.log(selectedVerse.verse)
        showVerse();
      })
      .catch(error => {
        console.error('Fetch Error:', error);
      });    
}

  function showVerse() {
    getText();
}

function getText(){
    fetch(`https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/${selectedVerse.version}/books/${selectedVerse.book.toLowerCase()}/chapters/${selectedVerse.chapter}/verses/${selectedVerse.verse}.json`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json'
          }
    }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then(data => {
        // Handle the JSON data received api
        const p = document.createElement("p");
        p.setAttribute("id", "currentScripture");
        p.innerHTML = data.text;
        document.getElementById("verseText").appendChild(p);
      })
      .catch(error => {
        console.error('Fetch Error:', error);
      });    
}