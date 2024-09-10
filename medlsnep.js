// ---------------- on vérifie l'url actuel

urlNewtest = 'http://hwttpnwnmc00.zres.ztech/nmc/Supervision/OverviewMonitoring.aspx';

if (window.location != urlNewtest){
	if (window.confirm("Vous n'êtes pas sur la supervision d'exploitation Newtest\nVoulez-vous être redirigés ?")) {
	  location.assign(urlNewtest);
	}
    //location.assign(urlNewtest);
}

// ----------------- scan des robots

console.log("🔹 1/2 scan des robots ...");

a = document.querySelector("#ctl00_content_mainCallbackPanel_mainSplitter_treeSupervision_CD > ul > li > ul");

// --------------- récup des noms de robots + url properties depuis newtest 
// et enregistrement dans l'objet 
// liste_robots 
// au format : 
// NPC-IV-001P : "Robot;4493"

let liste_robots = {};

for (let i = 2; i < a.childElementCount; i++) {
//for (let i = 2; i < 50; i++) {
	
	let b = a.childNodes[i];
	let sonde = b.childNodes[1].children[0].lastChild.innerText;
	let oid = b.childNodes[1].children[0].getAttribute("oid");
	liste_robots[sonde] = oid;
}

console.log("✔️ ",Object.keys(liste_robots).length,"robots trouvés : ",liste_robots);


// --------------- recup des valeurs depuis properties 

console.log("🔹 2/2 scan des propriétés ...");

function getValuesFromProperties(sonde, oid, sondesDB){

	let url = "http://hwttpnwnmc00.zres.ztech/nmc/Supervision/SupervisionDetail.aspx?id=" + oid + "&r=24&v=Properties";

	fetch(url)
		.then(response => {

			return response.text()

		})
		.then(html => {
			
			let maSonde = {};
			
			const parser = new DOMParser();

			const doc = parser.parseFromString(html, "text/html");

			let poste = doc.querySelector("#mainCallbackPanel_panelProperties_lblRobotMachineKey").innerText;
			
			let en_panne_depuis = doc.querySelector("#mainCallbackPanel_panelProperties_lblLastStatusMessageLocal").innerText;
			
			let CR = sonde.split("-")[1];
		
			let localisation = doc.querySelector("#mainCallbackPanel_panelProperties_lblRobotLocation").innerText;
			
			maSonde.sonde = sonde;
			maSonde.oid = oid;
			maSonde.poste = poste;
			maSonde.en_panne_depuis = en_panne_depuis;
			maSonde.CR = CR;
			maSonde.localisation = localisation;
			
			sondesDB.add(maSonde);
			
			//console.log(sonde, poste, en_panne_depuis, CR, localisation);
			//console.log(maSonde);
			
		})
		.catch(error => {

			console.error("⛔️ ",sonde,' - Erreur à l\'ouverture de la page: ', error);

		});
}

// ----------------- on boucle parmi l'objet liste_robot pour récup les données 

// liste_test = {'NPC-AL-001P': "Robot;4472", 'NPC-AM-001P': "Robot;4473", 'NPC-AO-001P': "Robot;4474", 'NPC-AP-001P': "Robot;4475", 'NPC-AQ-001P': "Robot;4476", 'NPC-AV-001P': "Robot;4477", 'NPC-BI-001P': "Robot;4478", 'NPC-BP-001P': "Robot;4479", 'NPC-CA-001P': "Robot;4480"}
// liste_test = {'PUC-NF-A01P': "Robot;4569", 'PUC-MA-A03P': "Robot;6718", 'PUC-FI-A02P': "Robot;6710", 'PUC-CP-A02P': "Robot;5606", 'PUC-CL-A02P': "Robot;6703", 'PUC-AV-S02P': "Robot;4475"};

let sondesDB = [];

for (const sonde in liste_robots) {

	getValuesFromProperties(sonde, liste_robots[sonde], sondesDB);
	
}

console.log("✔️ database de sondes au format JSON créée ➡️ faire click droit, \"copy object\"",sondesDB);
