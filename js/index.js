const Search = document.querySelector(".se-arch");
const results = document.querySelector("#results")


const clientID = '59ff74ee77f144288cb7a88c0ac2608b';
const clientSecret = 'd52a5f3fc867486f81fc853a3140956e';

let newBuffer=ethereumjs.Buffer.Buffer.from(clientID+':'+clientSecret).toString('base64');

let headers=new Headers();
headers.append('Authorization',`Basic ${newBuffer}`);
headers.append('Content-Type','application/x-www-form-urlencoded');


async function view(){
    let res=await fetch('https://accounts.spotify.com/api/token',{
        method:"post",
        headers:headers,
        body:'grant_type=client_credentials'
    })
    let json=await res.json();
   
    let {access_token}=await json;
      return access_token;
}

async function song(id){
    let token=await view()
    let splitId=id.split(':');
    let res=await fetch(`https://api.spotify.com/v1/tracks/${splitId[2]}`,{
        headers:{
            "Authorization":`Bearer ${token}`
        }
    });
    let json=await res.json();
    console.log(json);

    let div=document.createElement('div');
    div.className = "DIV"

    let h1=document.createElement('h1');
    h1.textContent=json.name;

    let h2 = document.createElement('h2');
    h2.textContent = `Album Name: ${json.album.name}`;

    let image = document.createElement('img');
    image.src=json.album.images[0].url;

    let artist = document.createElement('p');
    artist.textContent = json.album.artists[0].name;

    let date = document.createElement('p');
    date.textContent = `Released : ${json.album.release_date}`;

    let albumLink = document.createElement('a');
    albumLink.textContent = `Link To Album`
    albumLink.href=json.album.external_urls.spotify;
    albumLink.target='_blank'

    let TrackLink = document.createElement('a');
    TrackLink.textContent = `Link To Track`;
    TrackLink.href = json.external_urls.spotify;
    TrackLink.target = '_blank'

    let btn = document.createElement('button');

    btn.addEventListener('click', ()=> {
        document.getElementById('container').style.display='flex';
        div.style.display='none'
    })

    btn.textContent='Go Back'

    div.append(image, h1, h2, artist, date, albumLink,TrackLink);

    div.append(btn);

    let song=document.getElementById('singleSong');
    song.append(div);

}

async function search(song_name){
  let token=await view()
  let containerDiv=document.getElementById('container')
  containerDiv.innerHTML=''
    let res=await fetch(`https://api.spotify.com/v1/search?q=remaster%2520track=${song_name}&type=track`,{
        headers:{
            "Authorization":`Bearer ${token}`,
        }
    });
    let json=await res.json()
    console.log(json)

    for(i in json.tracks.items){
        let info = document.createElement('div');
        info.id='info';

        let div=document.createElement('div');
        div.id='div';
        div.className = json.tracks.items[i].uri;

        let name=document.createElement('h1');
        name.textContent=json.tracks.items[i].name;

        let artist=document.createElement('p');
        artist.textContent=json.tracks.items[i].artists[0].name;

        let img=document.createElement('img');
        img.src=json.tracks.items[i].album.images[0].url;

        info.append(name,artist);
        div.append(img,info);
        
        containerDiv.append(div);
        console.log(json.tracks.items[i].artists.name);

        div.addEventListener('click', async()=> {
            document.getElementById('container').style.display='none'
         song(div.className)
        })
    }
}


Search.addEventListener('input', async ()=> {
    const query = Search.value.trim().toLowerCase();

    if (query.length === 0) {
        results.innerHTML = "";
        return
    }else{
        search(query);
    }
});

