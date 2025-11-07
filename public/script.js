async function loadEntries() {
  try {
    const response = await fetch("http://localhost:3000/api/entries");
    if (!response.ok) throw new Error("Failed to fetch entries");
    
    const entries = await response.json();
    console.log("Fetched entries:", entries); // Debugging log

    const container = document.getElementById("savedEntries");
    container.innerHTML = "";

    if (entries.length === 0) {
      container.innerHTML = "<p class='text-muted'>No journal entries yet.</p>";
      return;
    }

    entries.forEach(entry => {
      const card = document.createElement("div");
      card.classList.add("card", "shadow-sm");
      card.style.width = "18rem";
      card.innerHTML = `
        <div class="card-body">
          <h4 class="card-title">${entry.title}</h4>
          <p class="card-text">${entry.content}</p>
          <p class="text-muted" style="font-size: 0.8em;">
            ${new Date(entry.created_at).toLocaleString()}
          </p>
        </div>
         <div class="d-flex justify-content-between mt-2">
      <button class="btn btn-primary btn-sm view-btn" 
        data-bs-toggle="modal" 
        data-bs-target="#entryModal"
        data-title="${entry.title}"
        data-content="${entry.content}">
        View
      </button>
      <button class="btn btn-danger btn-sm delete-btn" 
        data-id="${entry.id}">
        Delete
      </button>
    </div>
    </div>
      `;
      container.appendChild(card);
    });

    // View Button
    document.querySelectorAll(".view-btn").forEach(btn=>{
        btn.addEventListener('click', e=>{
            const title = e.target.getAttribute("data-title");
            const content = e.target.getAttribute("data-content");

            document.getElementById("entryModalLabel").innerText = title;
            document.getElementById("entryModalBody").innerText = content;
            
        })
    })

    // Delete Button
    document.querySelectorAll(".delete-btn").forEach(btn=>{
        btn.addEventListener('click', async e=>{
            const id = e.target.getAttribute("data-id");
            if(confirm("Are you sure you want to delete this entry")){
                await deleteEntry(id);
            }
        })
    })

  } catch (err) {
    console.error("Error loading entries:", err);
  }
}

async function deleteEntry(id){
    try{
        const res = await fetch(`http://localhost:3000/api/entries/${id}`, {
      method: "DELETE",
    });

    if(!res.ok) throw new Error("Failed to delete entry");
    alert("🗑️ Entry deleted successfully!");
    loadEntries();
    }
    catch(err){
        console.error("Error deleting entry:", err);
        alert("Something went wrong while deleting");
    }
}

document.getElementById("savebtn").addEventListener("click", async () => {
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("entry").value.trim();

  if (content === "" || title === "") {
    alert("Please write in both sections before saving");
    return;
  }


    try{
    const res = await fetch("http://localhost:3000/api/journals", {
        method: 'POST',
        headers: {'Content-type':'application/json'},
        body: JSON.stringify({title, content})
    });

    const text = await res.text();
    alert(text);

    document.getElementById("title").value="";
    document.getElementById("entry").value="";

    loadEntries();

    }catch(err){
        console.error("Error:",err);
        alert("Something went wrong!");

    }
});

// 🔍 Navbar Search Logic
document.getElementById("navSearchBtn").addEventListener("click", function (event) {
  event.preventDefault(); // Stop form from reloading the page

  const query = document.getElementById("navSearchInput").value.toLowerCase();
  const cards = document.querySelectorAll("#savedEntries .card");

  cards.forEach(card => {
    const title = card.querySelector(".card-title").textContent.toLowerCase();
    const content = card.querySelector(".card-text").textContent.toLowerCase();

    if (title.includes(query) || content.includes(query)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});


document.addEventListener("DOMContentLoaded", loadEntries);

 // else
    // {

    //     journals.push({ title: title, content: content });
    //     const newdiv = document.createElement('div');
    //     newdiv.classList.add('card');
    //     // newdiv.classList.add('d-flex flex-wrap gap-3 p-3 justify-content-center')
    //     newdiv.style.width = '18rem';

    //     const cardbody = document.createElement('div');
    //     cardbody.classList.add('card-body');

    //     const cardtitle = document.createElement('h4');
    //     cardtitle.classList.add('card-title');
    //     cardtitle.textContent = title;

    //     const cardcontent = document.createElement('p');
    //     cardcontent.classList.add('card-text');
    //     cardcontent.textContent = content;

    //     // delete button
    //     const del = document.createElement('button');
    //     del.classList.add('btn');
    //     del.classList.add('dele');
    //     del.innerHTML = '<b>Delete</b>'

    //     // View button
    //     const view = document.createElement('button');
    //     view.classList.add('btn');
    //     view.classList.add('view');
    //     view.innerHTML = '<b>View</b>';

    //     // view.setAttribute('data-bs-toggle', 'modal'); 
    //     // view.setAttribute('data-bs-target', '#entryModal');


    //     cardbody.appendChild(cardtitle);
    //     cardbody.appendChild(cardcontent);
    //     cardbody.appendChild(del);
    //     cardbody.appendChild(view);

    //     newdiv.appendChild(cardbody);

    //     del.addEventListener('click', ()=>{
    //         newdiv.remove();
    //     });

    //     view.addEventListener('click', ()=>{
    //         document.getElementById('entryModalLabel').innerText = title;
    //         document.getElementById('entryModalBody').innerText = content;

    //         const modalEl = document.getElementById('entryModal');
    //         const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    //         modal.show();
    //     })


        

    //     let savedentries = document.getElementById('savedEntries');
    //     savedentries.appendChild(newdiv);

    //     // title.value = "";
    //     // content.value = "";

    //     document.getElementById('title').value = "";
    //     document.getElementById('entry').value = "";

    // }
