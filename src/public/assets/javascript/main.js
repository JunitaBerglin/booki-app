const searchButton = document.getElementById('search_button')

const graphQlQuery = async (url, query, variables = {}) => {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query,
			variables,
		}),
	})

	const res = await response.json()
	return res.data
}

/*-------------------------------------------- FÖR QUERY ---------------------------------------------*/

//Syfte: se nedan
//Vi skapar en query-variabel som innehåller type syntax för hur en query ser ut i apollo server - och som matchar vår query i vårt schema
//Denna syntax kan man hitta (och copy-pastea om man vill) i sin graphql playground på apollo server (om man inte kan det i huvudet).
//textsträng som skickas till graphql för tolkning - följer därav syntax
//1. query - vi ska göra en query, -optional att skriva getAllBooksQuery efter, som samlingsnamn för queries i bodyn
//2. andra getAllBooks är namnet på resolvern vi vill ha
//3. fälten vi vill ha tillbaka

let allBooks = []

const getAllBooksQuery = `query getAllBooks {
    getAllBooks {
        title,
        author,
        category,
        grade,
        audiobook,
        id
    }
  }`

searchButton.addEventListener('click', async () => {
	getAllBooksFronend()
})

async function getAllBooksFronend() {
	// Nu hämtar vi o lyssnar på knappen som ska visa listan, och inne i anonyma funktionen på vår addEventListener:
	// - awaitar vi inbyggda funktionen graphQLQuery (och skickar med url:en, samt query-variabeln vi nyss skapade.
	// - vi skapar även en variabel för att fånga upp ett objekt i vår response, nämligen listan vi får tillbaka
	// - Sist anropar vi createHTML med denna lista.
	const response = await graphQlQuery('http://localhost:5001/graphql', getAllBooksQuery)

	console.log(response)

	allBooks = response.getAllBooks

	console.log(allBooks)

	createHTML(allBooks)
}

function createHTML(allBooks) {
	let allBooksList = document.getElementById('allBooksList')
	allBooksList.innerHTML = ''

	for (let i = 0; i < allBooks.length; i++) {
		let bookContainer = document.createElement('div')
		let bookTitle = document.createElement('h5')
		let bookAuthor = document.createElement('h6')
		let bookCategory = document.createElement('p')
		let bookGrade = document.createElement('p')

		bookContainer.classList.add('book')
		bookTitle.classList.add('book__title')
		bookAuthor.classList.add('book__author')
		bookCategory.classList.add('book__cathegory')
		bookGrade.classList.add('book__grade')
		bookAudiobook.classList.add('book__audiobook')
		bookId.classList.add('book__id')

		bookTitle.innerHTML = allBooks[i].title
		bookAuthor.innerHTML = allBooks[i].author
		bookCategory.innerHTML = allBooks[i].category
		bookGrade.innerHTML = allBooks[i].grade
		bookAudiobook.innerHTML = allBooks[i].audiobook
		bookId.innerHTML = allBooks[i].id

		bookContainer.appendChild(bookTitle)
		bookContainer.appendChild(bookAuthor)
		bookContainer.appendChild(bookCategory)
		bookContainer.appendChild(bookGrade)
		allBooksList.appendChild(bookContainer)
	}
}
createHTML(allBooks)

/*-------------------------------------------- FÖR MUTATION ---------------------------------------------*/

//Syfte: se nedan
//Vi skapar en query-variabel som innehåller type syntax för hur en query ser ut i apollo server - och som matchar vår query i vårt schema
//Denna syntax kan man hitta (och copy-pastea om man vill) i sin graphql playground på apollo server (om man inte kan det i huvudet).
//textsträng som skickas till graphql för tolkning - följer därav syntax
//Nu vill vi göra en mutation, sen har vi samlingsnamnet, sen paranteser m in-parametrar, sen matchar vi dem -
//- skickar in ett js objekt som matchar - dollartecknet är framför det variabelnamn vi måste använda (ett sätt för graphql att skilja variabelnamnet från annat).
//sen skickar vi med objektet... matchar schemat.
const addNewBook = `query createBook($input: createBookInput) {
    createBook (input: $input) {
        title,
        author,
        category,
        grade,
        audiobook,
        id
    }
  }`

async function handleSubmit() {
	//vi lyssnar på knappen för att submit:a formuläret.
	const submitForm = document.querySelector('#submitForm')

	submitForm.addEventListener('submit', async (e) => {
		e.preventDefault()

		const name = e.target.querySelector('#addNameTextBox').value //Petters lösning. Röd squiggly pga typescript checker säger är fel, men funkar i JS. //OBS! SKulle EJ gå att kompilera!
		const description = e.target.querySelector('#addDescriptionTextBox').value //Petters lösning. Röd squiggly pga typescript checker säger är fel, men funkar i JS. //OBS! SKulle EJ gå att kompilera!
		// console.log(name);
		// console.log(description);

		const response = await fetch('/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: addNewBook, //säger vad jag vill att graphql ska göra
				variables: {
					//matchar min apollo server variable
					input: {
						name: name,
						description: description,
					},
				},
			}),
		})

		const data = await response.json()
		// console.log(data);

		//Lägga till på listan och uppdatera html

		//Rensa inputs
		e.target.querySelector('#addNameTextBox').value = '' //Petters lösning. Röd squiggly pga typescript checker säger är fel, men funkar i JS. //OBS! SKulle EJ gå att kompilera!
		e.target.querySelector('#addDescriptionTextBox').value = '' //Petters lösning. Röd squiggly pga typescript checker säger är fel, men funkar i JS. //OBS! SKulle EJ gå att kompilera!

		//Skapa upp nya listan i html
		const newListResponse = await graphQlQuery('http://localhost:5000/graphql', getAllHiddenGemsQuery)
		// console.log(newListResponse);

		let newBookList = newListResponse.getAllBooks

		createHTML(allBooks)
	})
}
// ovanstående in progress...

/*-------------------------------------------- FÖR HTML ---------------------------------------------*/

// Vi skapar sen upp detta i html med en "vanlig" createHTML funktion:

function createHTML(allBooks) {
	let allBooksList = document.getElementById('allBooksList')
	allBooksList.innerHTML = ''

	for (let i = 0; i < allBooks.length; i++) {
		let bookContainer = document.createElement('div')
		let bookTitle = document.createElement('h5')
		let bookAuthor = document.createElement('h6')
		let bookCategory = document.createElement('p')
		let bookGrade = document.createElement('p')

		bookContainer.classList.add('book')
		bookTitle.classList.add('book__title')
		bookAuthor.classList.add('book__author')
		bookCategory.classList.add('book__cathegory')
		bookGrade.classList.add('book__grade')
		bookAudiobook.classList.add('book__audiobook')
		bookId.classList.add('book__id')

		bookTitle.innerHTML = allBooks[i].title
		bookAuthor.innerHTML = allBooks[i].author
		bookCategory.innerHTML = allBooks[i].category
		bookGrade.innerHTML = allBooks[i].grade
		bookAudiobook.innerHTML = allBooks[i].audiobook
		bookId.innerHTML = allBooks[i].id

		bookContainer.appendChild(bookTitle)
		bookContainer.appendChild(bookAuthor)
		bookContainer.appendChild(bookCategory)
		bookContainer.appendChild(bookGrade)
		allBooksList.appendChild(bookContainer)
	}
}
createHTML(allBooks)
