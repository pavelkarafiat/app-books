async function loadCsv() {
    
    let books = [];
    /*const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTpsmdU_Esx3BZPjbRLtK8uVKqcm2-5nMtYzjcuyAWez86H3TlJGFKS2-ooy3e4WuP4FxLjyJJza4H9/pub?gid=0&single=true&output=tsv');*/
    const response = await fetch('knihy.tsv');
    const data = await response.text();
    const table = data.split('\n').slice(1);
    
    table.forEach(row => {
        let col = row.split('\t');
        let entry = {
            autor: col[0],
            nazev: col[1],
            original: col[2],
            precteno: col[3],
            vydano: col[4],
            imglink: col[5],
            tagy: col[6],
            popis: col[7]
        }
        books.push(entry)
    });
    return books;
}

function lazyAnimating(){
    const elements = document.querySelectorAll('img[data-src]');
    elements.forEach((img)=>{
        img.setAttribute('src', img.getAttribute('data-src'));
        img.onload = ()=>img.removeAttribute('data-src');
    });
}


function processData(books){
    books.reverse();
    books.sort((a, b) => {return b.precteno - a.precteno});
    return books;
}

function getOrderedTags(books){
    let alltags = [];
    let totalcount = 0;
    for(let i=1; i<books.length;i++){
        let tags = books[i].tagy.split(',');
        tags.forEach(el=>{
            el = el.trim();
            let founded = alltags.findIndex(({tag})=>tag == el );
            if (founded == -1){
                let entry = {tag: el, count: 1}
                alltags.push(entry);
            }
            else {
                alltags[founded].count++;
            };
        });
    };
    alltags.sort((a, b) => {return b.count - a.count});
    alltags=alltags.filter(a=>{return a.count>3});
    alltags.unshift({tag:'all',count:books.length})
    return alltags;
}

function getInterestingAutors(books){
    let allAutors = [];
    for(let i=1; i<books.length;i++){
        let autors = books[i].autor.split(',');
        autors.forEach(el=>{
            el = el.trim();
            let founded = allAutors.findIndex(({autor})=>autor == el );
            if (founded == -1){
                let entry = {autor: el, count: 1}
                allAutors.push(entry);
            }
            else {
                allAutors[founded].count++;
            };
        });
    };
    allAutors.sort((a, b) => {return b.count - a.count});
    allAutors=allAutors.filter(autor=>{return autor.count>3});
    //console.log(allAutors);
}


async function renderBooks(){
    
    let books = await loadCsv();
    books = processData(books);   

    const root = document.getElementById("container-books");
    
    for(let i =1;i<books.length;i++){
        const bookAutor = books[i].autor;
        const bookNazev = books[i].nazev;
        const bookImg = books[i].imglink;
        const bookPrecteno = books[i].precteno;
        const bookVydano = books[i].vydano;
        const bookTagy = books[i].tagy.split(',');
        const htmlRoot = document.createElement('div');
        const htmlAutor = document.createElement('h2');
        const htmlNazev = document.createElement('h3');
        const htmlImg = document.createElement('img');
        const htmlYears = document.createElement('div');
        const htmlPrecteno = document.createElement('span');
        const htmlVydano = document.createElement('span');
        const htmlTagy = document.createElement('div');
        htmlTagy.setAttribute('class', 'tags');
        
        bookTagy.forEach(tag =>{
            tag = tag.trim();
            const htmlTag = document.createElement('span');
            htmlTag.innerText = tag;
            htmlTagy.append(htmlTag);
        })
        
        htmlAutor.innerText = bookAutor;
        htmlNazev.innerText = bookNazev;
        htmlImg.setAttribute('data-src', `img/${bookImg}`);
        htmlImg.setAttribute('loading', 'lazy');
        htmlPrecteno.innerText = bookPrecteno;
        htmlVydano.innerText = bookVydano;
        
        htmlRoot.setAttribute('class', 'entry-books');
        htmlYears.setAttribute('class', 'years');
        htmlRoot.append(htmlImg);
        htmlRoot.append(htmlYears);
        htmlRoot.append(htmlAutor);
        htmlRoot.append(htmlNazev);
        htmlRoot.append(htmlTagy);
        htmlYears.append(htmlPrecteno);
        htmlYears.append(htmlVydano);
        root.append(htmlRoot);
    }
    lazyAnimating();
    //buttons();
    renderMenu(getOrderedTags(books));
    //getInterestingAutors(books);
}

function filterTags(filter){
    let elems = document.querySelectorAll(".entry-books");
    elems.forEach(el=>{
        let tags = el.querySelectorAll(".tags > span");
        let found = false;
        tags.forEach(tag=>{
            if(found == false){
                if (tag.innerText==filter){
                    el.style.display = "block";
                    found = true;
                }
                else {
                    el.style.display = "none";
                }
            }
        });
    });
}



function renderMenu(items){
    let active = 'all';
    const root = document.getElementById("menu");
    root.innerHTML='';
    
    for(let i=0;i<items.length;i++){
        const htmlItem = document.createElement('span');
        htmlItem.innerText=`${items[i].tag}: ${items[i].count}`;
        htmlItem.setAttribute('class', 'menuitem');
        if(active == items[i].tag){
            htmlItem.style.backgroundColor='#d7194a';
            htmlItem.style.color='white';
        }
        
        htmlItem.addEventListener('click',(evt)=>{
            if (i==0){
                showAll();
            }
            else filterTags(items[i].tag);
            
            active=items[i].tag;
            let allmenu = document.querySelectorAll('.menuitem');
            allmenu.forEach(e=>{
                e.style.backgroundColor='rgb(236, 234, 234)';
                e.style.color='rgb(130,130,130)';
            })
            
            if(active == items[i].tag){
                htmlItem.style.backgroundColor='#d7194a';
                htmlItem.style.color='white';
            }
        });
        root.append(htmlItem);
    };
}


function showAll(){
    let elems = document.querySelectorAll(".entry-books");
    elems.forEach(el=>{el.style.display = "block";})
}

function buttons(){
    document.getElementById('home').addEventListener('click',(evt)=>{showAll();});
    let elems = document.querySelectorAll(".entry-books > .tags > * ");
    elems.forEach(el=>{
        el.addEventListener('click',(evt)=>{
            filterTags(el.innerText);
        });
    });
}

renderBooks();














