let wpsn_title = 'Web Page Sticky Notes';
let wpsn_globalURL = 'http://www.google.com/blank.html?global';
let wpsn_bookmarks;
let copied_notes = '';
let urlData = {

};
let commands = {};
;


/*GOOGLE DRIVE API START*/
/*
  "permissions": [
	"identity"
  ],
  "content_security_policy": "script-src 'self' https://apis.google.com; object-src 'self'",
  "oauth2": {
	"client_id": "[client ID]",
	"scopes": [
		"https://www.googleapis.com/auth/drive"
	]   
  },  
*/
async function GAPI_Loaded() {
	await GAPI.api.loadGapiModules();
}

const boundary = '-------314159265358979323846';
const GAPI = {
	enabled: true,
	loaded: false,
	js: 'https://apis.google.com/js/api.js',
	revokeTokenUrl: 'https://accounts.google.com/o/oauth2/revoke?token=',
	discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
	folderMimeType: 'application/vnd.google-apps.folder',
	contentType: 'application/json',
	boundary: boundary,
	delimiter: "\r\n--" + boundary + "\r\n",
	close_delim: "\r\n--" + boundary + "--",
	fileByIdRoot: 'https://www.googleapis.com/drive/v3/files/',
	createFolderRoot: 'https://www.googleapis.com/drive/v3/files/',
	writeToFileRoot: 'https://www.googleapis.com/upload/drive/v3/files/',
	wpsnFolderName: 'WebPageStickyNotes',
	wpsnFileName: 'sync.wpsn',
	intervalBetweenSynchronization: 5 * 1000, //prevent DDOS
	intervalBetweenAutoSynchronization: 24 * 60 * 60 * 1000, //prevent Quota abuse
	api: {
		loadGapi: function() {
			return new Promise(function(resolve){
				var head = document.getElementsByTagName('head')[0];
				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = `${GAPI.js}`;//?onload=GAPI_Loaded`;
				script.onload = function() {
					resolve();
				}
				head.appendChild(script);
			});
		},
		loadGapiModules: async function() {
			return new Promise(function(resolve){
				gapi.load('client', async function(){
					await GAPI.api.initGapiModules();
					GAPI.loaded = true;
					resolve();
				});
			})
		},
		initGapiModules: async function() {
			await gapi.client.init({
				discoveryDocs : GAPI.discoveryDocs
			});
			await GAPI.api.updateToken();
		},
		getToken: async function(props = {}) {
			return new Promise(function(resolve) {
				chrome.identity.getAuthToken({'interactive': !props.noninteractive}, function (token) {
					resolve(token);
				});
			});
		},
		removeToken: function() {
			return new Promise(async function(resolve){
				let token = await GAPI.api.getToken({noninteractive:true});
				if (!token) { resolve(); } 
				else {
					let xmlHttp = new XMLHttpRequest();
					xmlHttp.open('GET', GAPI.revokeTokenUrl + token);
					xmlHttp.onload = function() { 
						chrome.identity.removeCachedAuthToken({ 'token': token }, function(){
							resolve();
						});
					}
					xmlHttp.onerror = function() { 
						resolve();
					}
					xmlHttp.send();
				}
			});
		},
		updateToken: async function () {
			let token = await GAPI.api.getToken();
			gapi.client.setToken({access_token: token});
			return token;
		},
		key: function() {
			return chrome.runtime.id;
		},
		hashCode: function(string) {
			var hash = 0, i, chr;
			if (string.length === 0) return hash;
			for (i = 0; i < string.length; i++) {
			  chr   = string.charCodeAt(i);
			  hash  = ((hash << 5) - hash) + chr;
			  hash |= 0; // Convert to 32bit integer
			}
			return hash;
		},
		readJSON : async function(decrypt) {
			GAPI.wpsnFile = GAPI.wpsnFile || await GAPI.api.getFile(GAPI.wpsnFolderName, GAPI.wpsnFileName, {createIfMissing: true});
			let content = await GAPI.api.getFileContent(GAPI.wpsnFile);
			try {
				if (decrypt) {
					content = CryptoJS.AES.decrypt(content,GAPI.api.key(GAPI.wpsnFile)).toString(CryptoJS.enc.Utf8);
				}
				GAPI.lastReadHash = GAPI.api.hashCode(content);
				return JSON.parse(content);
			} catch (err) {
				return {};
			}
		},
		writeJSON : async function(json, encrypt) {
			let jsonString =  JSON.stringify(json);
			let hash = GAPI.api.hashCode(jsonString);
			if (GAPI.lastReadHash == hash) { return; }
			GAPI.wpsnFile = GAPI.wpsnFile || await GAPI.api.getFile(GAPI.wpsnFolderName, GAPI.wpsnFileName, {createIfMissing: true});
			if (encrypt) {
				jsonString = CryptoJS.AES.encrypt(jsonString,GAPI.api.key(GAPI.wpsnFile)).toString();
			}
			await GAPI.api.writeContentToFile(GAPI.wpsnFile, jsonString);
		},
		getFileContent: async function(file) {
			return new Promise(async function(resolve){
				let url = GAPI.fileByIdRoot + file.id + '?alt=media'
				let xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.responseType = 'blob';
				let token = await GAPI.api.getToken();
				xhr.setRequestHeader("Authorization", 'Bearer ' + token);
				xhr.onload = function () {
					var reader = new FileReader();
					reader.onload = function() {
						resolve(reader.result);
					}
					reader.readAsText(this.response);
				};
				xhr.send();
			});
		},
		writeContentToFile: async function(file, content) {
			return new Promise(async function(resolve){
				let metadata = {
					'mimeType': GAPI.contentType
				};
				
				let multipartRequestBody =
					GAPI.delimiter +
					'Content-Type: application/json\r\n\r\n' +
					JSON.stringify(metadata) +
					GAPI.delimiter +
					'Content-Type: ' + GAPI.contentType + '\r\n\r\n' +
					content +
					GAPI.close_delim;
			
				let token = await GAPI.api.getToken();
				let request = gapi.client.request({
					'path': GAPI.writeToFileRoot + file.id +'?uploadType=multipart',
					'method': 'PATCH',
					'headers': {		
					'Authorization': ('Bearer ' + token),
					'Content-Type': 'multipart/related; boundary="' + GAPI.boundary + '"'
					},
					'body': multipartRequestBody
				});
				
				request.execute(function(file){resolve(file);});
			});
		},
		getFile: async function(folderName, fileName, options={}) {
			return new Promise(async function(resolve){
				let folder = await GAPI.api.getFolder(folderName, options);
				if (folder && folder.id) {
					let allFiles = await GAPI.api.getFiles({q:`fullText contains '${fileName}' and '${folder.id}' in parents and trashed = false`});
					let files = allFiles.filter(function(file){
						return file.name === fileName
					});
					let file = files.length > 0 ? files[0] : null;
					if (file != null) {
						resolve(file); return;
					}
					if (options.createIfMissing) {
						let xhr = new XMLHttpRequest();
						xhr.open('POST', GAPI.createFolderRoot+'?alt=json');
						let token = await GAPI.api.getToken();
						xhr.setRequestHeader("Authorization", 'Bearer ' + token);
						xhr.setRequestHeader("Content-Type", "application/json");
						xhr.onload = function () {
							resolve(JSON.parse(this.response)); return;
						};
						xhr.send(JSON.stringify({
							'name': fileName,
							'mimeType': 'application/json',
							'parents': [folder.id]
						}));
					} else {
						resolve(null); return;
					}
				} else {
					resolve(null); return;
				}
			});
		},
		getFolder: async function(folderName, options={}) {
			return new Promise(async function(resolve){
				let allFiles = await GAPI.api.getFilesByName(folderName);
				let files = allFiles.filter(function(file){
					return file.mimeType === GAPI.folderMimeType	
				});
				let file = files.length > 0 ? files[0] : null;
				if (file != null) {
					resolve(file); return;
				}
				if (options.createIfMissing) {
					let xhr = new XMLHttpRequest();
					xhr.open('POST', GAPI.createFolderRoot+'?alt=json');
					let token = await GAPI.api.getToken();
					xhr.setRequestHeader("Authorization", 'Bearer ' + token);
					xhr.setRequestHeader("Content-Type", "application/json");
					xhr.onload = function () {
						resolve(JSON.parse(this.response)); return;
					};
					xhr.send(JSON.stringify({
						'name': folderName,
						'mimeType': GAPI.folderMimeType
					}));
				} else {
					resolve(null); return;
				}
			});
		},
		getFilesByName: async function(fileName) {
			let allFiles = await GAPI.api.getFiles({q:`fullText contains '${fileName}' and trashed = false`});
			let files = allFiles.filter(function(file){
				return file.name === fileName	
			});
			return files;
		},
		getFiles: async function(filter) {
			return new Promise(function(resolve){
				gapi.client.drive.files.list(filter).then(function(response){
					if (response && response.result && response.result.files) {
						resolve(response.result.files)
					}
				});
			});
		}
	}
};

/*GOOGLE DRIVE API END*/


function wpsn_loadBookmarks(callback,url,title) {
	chrome.bookmarks.getTree(function(curentBookmarkTreeNodes) {
		let otherBookmarks = curentBookmarkTreeNodes[0].children[1];
		for (let i = 0; i < otherBookmarks.children.length; i++) {
			let temp_bkmrk = otherBookmarks.children[i];
			if (temp_bkmrk.title === wpsn_title) {
				wpsn_bookmarks = temp_bkmrk;
				if (callback) { callback(url,title); }
				return;
			}
		}
		chrome.bookmarks.create({'parentId': otherBookmarks.id, 'title': wpsn_title},
			function(newFolder) {
				log('added folder: ' + newFolder.title);
				wpsn_bookmarks = newFolder;
				if (callback) { callback(url,title); }
			}
		);
	});
}

function wpsn_getBookmark(url) {
	if (wpsn_bookmarks.children) {
		for (let i = 0; i < wpsn_bookmarks.children.length; i++) {
			let bkmrk = wpsn_bookmarks.children[i];
			if (bkmrk.url === url) {
				return bkmrk;
			}
		}
	}
	return null;
}

function wpsn_saveBookmarkAndGlobalBookmark(url, title) {
	if (title) {
		let notes = [];
		let globalNotes = [];
		let allNotes = JSON.parse(title);
		for (let i = 0; i < allNotes.length; i++) {
			if (allNotes[i].globalMode) {
				globalNotes.push(allNotes[i]);
			} else {
				notes.push(allNotes[i]);
			}
		}
		wpsn_loadBookmarksAndSaveBookmark(url, JSON.stringify(notes));
		wpsn_loadBookmarksAndSaveBookmark(wpsn_globalURL, JSON.stringify(globalNotes));
	}
}

function wpsn_loadBookmarksAndRemoveBookmark(url) {
	wpsn_loadBookmarks(wpsn_removeBookmark,url);
}

function wpsn_removeBookmark(url) {
	let bkmrk = wpsn_getBookmark(url);
	if (bkmrk) {
		try {
			let t = bkmrk.title;
			chrome.bookmarks.remove(bkmrk.id);
			log('removed bookmark: ' + t);
		}catch(err){error(err);}
	}
}

function wpsn_loadBookmarksAndSaveBookmark(url,title) {
	wpsn_loadBookmarks(wpsn_saveBookmark,url,title);
}

function wpsn_saveBookmark(url, title) {
	if (url && typeof title != 'undefined') {
		if (!title) {
			title = url;
		}
		let bkmrk = wpsn_getBookmark(url);
		let hash;
		if (url.indexOf('#') > -1) {
			hash = unescape(url.substring(url.indexOf('#')+1));
		}
		if (hash && hash.indexOf('[') > -1 && hash.indexOf('{') > -1 && hash.indexOf('"') > -1 && hash.indexOf('id') > -1) {
			//don't save
		} else {
			if (bkmrk != null) {//update
				if (title != '[]') {
					try {
						chrome.bookmarks.update(bkmrk.id, {'title':title}, function(result){
							bkmrk = result;
						});
					}catch(err){error(err);}
				} else {
					try {
						let t = bkmrk.title;
						chrome.bookmarks.remove(bkmrk.id);
						log('removed bookmark: ' + t);
					}catch(err){error(err);}
				}
			} else if (title != '[]') {//create
				try {
					chrome.bookmarks.create({'parentId': wpsn_bookmarks.id, 'url' : url , 'title' : title},
						function(bookmark) {
							log('added bookmark: ' + bookmark.title);
						}
					);
				}catch(err){error(err);}
			}
		}
	}
}

chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.executeScript(null,{file:'popup.js'});
});


chrome.extension.onMessage.addListener(function(msg,sender,sendResponse) {
	let func = async function(msg,sender,sendResponse) {
		if (msg.synchronize) {
			if (GAPI.enabled && !GAPI.loaded && !msg.logout) { 
				await GAPI.api.loadGapi();
				await GAPI.api.loadGapiModules();
			}
			if (msg.logout) {
				await GAPI.api.removeToken();
				chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.sendRequest(tab.id, {synchronize:true, loggedout:true}, function() {});
				});
			}
			let synchronize = true;
			if (msg.fetch && GAPI.lastSynchronization) {
				let elapsed = new Date() - GAPI.lastSynchronization;
				if (msg.autosynchronize && elapsed < GAPI.intervalBetweenAutoSynchronization) { // prevent Quota abuse
					synchronize = false;
				} else if (!msg.autosynchronize && elapsed < GAPI.intervalBetweenSynchronization) { // prevent DDOS
					synchronize = false
				}
			}
			if (synchronize) {
				if (msg.fetch) {
					GAPI.lastSynchronization = new Date();
					GAPI.api.readJSON(true).then(function(result){
						chrome.tabs.getSelected(null, function(tab) {
							chrome.tabs.sendRequest(tab.id, {synchronize:true, result:result}, function() {});
						});
					});
				} else if (msg.result) {
					GAPI.api.writeJSON(msg.result, true).then(function(){
						chrome.tabs.getSelected(null, function(tab) {
							chrome.tabs.sendRequest(tab.id, {synchronize:true, synchronized:true}, function() {});
						});
					});
				}
			}
		}
		
		if (msg.screenshot) {
			chrome.tabs.captureVisibleTab(null, {format:'png', quality:100}, function(dataUrl) {
				sendResponse({ screenshotUrl: dataUrl });
			});
		}
		if (msg.stickyCount) {
			if (msg.url) {
				chrome.tabs.getSelected(null, function(tab) {
					if (tab.url === msg.url) {
						if (msg.stickyCount === '0') {
							chrome.browserAction.setBadgeText({text: ''});
							//chrome.browserAction.setBadgeBackgroundColor({color: '#ffffaa'});
						} else {
							chrome.browserAction.setBadgeText({text: ''+msg.stickyCount});
							if (msg.stickyInvisible){
								chrome.browserAction.setBadgeBackgroundColor({color: '#eee'});
							} else {
								chrome.browserAction.setBadgeBackgroundColor({color: '#ff0000'});
							}
						}
					}
				});
			} else {
				if (msg.stickyCount === '0') {
					chrome.browserAction.setBadgeText({text: ''});
					//chrome.browserAction.setBadgeBackgroundColor({color: '#ffffaa'});
				} else {
					chrome.browserAction.setBadgeText({text: ''+msg.stickyCount});
					chrome.browserAction.setBadgeBackgroundColor({color: '#ff0000'});
				}
			}
		}

		if (msg.bookmark) {	
			if (msg.bookmark.remove) {
				wpsn_loadBookmarksAndRemoveBookmark(msg.bookmark.url);
			} else {
				wpsn_loadBookmarksAndSaveBookmark(msg.bookmark.url, msg.bookmark.title);
			}
		}

		if (msg.saveNotes) {
			let bkmrk = wpsn_getBookmark(msg.saveNotes.url);
			if (msg.saveNotes.notCurrentPage) {
				let oldNotes = JSON.parse(bkmrk.title);
				let newNotes = JSON.parse(msg.saveNotes.notes);
				for (let i = 0; i < newNotes.length; i++) {
					let newNote = newNotes[i];
					let found = false;
					for (let j = 0; j < oldNotes.length; j++) {
						let oldNote = oldNotes[j];
						if (newNote.id === oldNote.id) {
							for (let key in oldNote) {oldNote[key] = null;}
							for (let key in newNote) {oldNote[key] = newNote[key];}
							found = true;
							break;
						}
					}
					if (!found) {
						oldNotes.push(newNote);
					}
				}
				wpsn_saveBookmarkAndGlobalBookmark(msg.saveNotes.url, JSON.stringify(oldNotes));
			} else {
				wpsn_saveBookmarkAndGlobalBookmark(msg.saveNotes.url, msg.saveNotes.notes);
			}
		}

		if (msg.loadNotes) {
			try {
				if (msg.loadNotes.indexOf('#') > -1) {
					let hash = unescape(msg.loadNotes.substring(msg.loadNotes.indexOf('#')+1));
					if (hash.indexOf('[') > -1 && hash.indexOf('{') > -1 && hash.indexOf('"') > -1 && hash.indexOf('id') > -1) {
						chrome.tabs.getSelected(null, function(tab) {
							chrome.tabs.sendRequest(tab.id, {loadNotesResponse: hash}, function() {});
						});
						return;
					}
				}
			}catch(err){error(err);}

			let bkmrk_url = msg.loadNotes;
			let bkmrk_title = '[]';

			let bkmrk = wpsn_getBookmark(msg.loadNotes);
			let globalBkmrk = wpsn_getBookmark(wpsn_globalURL);
			if (bkmrk != null) {
				bkmrk_url = bkmrk.url;
				bkmrk_title = bkmrk.title;
			}
			if (globalBkmrk != null) {
				let notes = JSON.parse(bkmrk_title);
				let globalNotes = JSON.parse(globalBkmrk.title);
				for (let i = 0; i < notes.length; i++) {
					globalNotes.push(notes[i]);
				}
				bkmrk_title = JSON.stringify(globalNotes);
			}

			chrome.windows.getAll({populate:true}, function (window_list) {
				for(let w = 0; w < window_list.length; w++) {
					for (let t = 0; t < window_list[w].tabs.length; t++) {
						let tab = window_list[w].tabs[t];

						if (tab.url === bkmrk_url) {
							chrome.tabs.get(tab.id, function(tab) {
								chrome.tabs.sendRequest(tab.id, {loadNotesResponse: bkmrk_title}, function() {});
							});
						}
					}
				}
			});
		}

		if (msg.download) {
			chrome.downloads.download(msg.download);
		}

		if (msg.upload) {
			upload(msg.upload);
		}

		if (msg.copySelectedNotes) {
			copied_notes = msg.copySelectedNotes;
		}
		if (msg.pasteCopiedNotes) {
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.sendRequest(tab.id, {pasteCopiedNotes: copied_notes, keepOriginalCoordinates: msg.keepOriginalCoordinates}, function() {});
			});
		}
		if (msg.getImageData) {
			getImageData(msg.url, msg.width, msg.height).then(function(imageData){
				sendResponse(imageData);
			});
		}
		if (msg.getUrlData) {
			getUrlData(msg.url, msg.interval).then(function(data){
				sendResponse(data);
			});
		}
		if (msg.github) {
			commitToGithub(msg.github);
		}
		if (msg.gotourl) {
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.update(tab.id, {url: msg.gotourl});
			});
		}
	};

	func(msg,sender,sendResponse);
	return true;
});

function commitToGithub(commit) {
	/*
	let username = commit.username;
	let authorization = commit.authorization;
	let repository = commit.repository;
	let branch = commit.branch;
	let path = commit.path;
	let content = commit.content;
	let message = commit.message;
	*/
	getSha(commit);
}

function getSha(commit) {
	//let token = commit.token;
	let username = commit.username;
	let authorization = commit.authorization;
	let repository = commit.repository;
	let path = commit.path;
	let api = 'https://api.github.com/repos/'+encodeURI(username)+'/'+encodeURI(repository);
	
	let xhr = new XMLHttpRequest();
	xhr.open('GET', api+'/contents/'+encodeURI(path), true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			if (xhr.responseText && xhr.responseText.length !== '') {
				let response = JSON.parse(xhr.responseText);
				if (response) {
					commit.sha = response.sha;
				}
			}
			if (!commit.sha) {
				let xhr2 = new XMLHttpRequest();
				xhr2.open('GET', api+'/git/refs/heads/main', true);
				xhr2.onreadystatechange = function () {
					if (xhr2.readyState == 4) {
						if (xhr2.status === 200 && xhr2.responseText && xhr2.responseText.length !== '') {
							let response = JSON.parse(xhr2.responseText);
							if (response) {
								let parentSha = [response.object.sha];
								let xhr3 = new XMLHttpRequest();
								xhr3.open('GET', api+'/git/commits/'+parentSha, true);
								xhr3.onreadystatechange = function () {
									if (xhr3.readyState == 4) {
										if (xhr3.status === 200 && xhr3.responseText && xhr3.responseText.length !== '') {
											let response = JSON.parse(xhr3.responseText);
											if (response) {
												commit.parents = [response.sha];
												commit.tree = response.tree.sha;
												
												let xhr4 = new XMLHttpRequest();
												xhr4.open('POST', api+'/git/commits', true);
												xhr4.onreadystatechange = function () {
													if (xhr4.readyState == 4) {
														if (xhr4.status === 201 && xhr4.responseText && xhr4.responseText.length !== '') {
															let response = JSON.parse(xhr4.responseText);
															if (response) {
																commit.sha = response.sha;
															}
														} else {
															commitResponse(xhr4.responseText);
														}
														writeFileToCommit(commit);
													} 
												};
												xhr4.setRequestHeader('Authorization', 'Basic ' + authorization);
												xhr4.setRequestHeader('Accept', 'application/vnd.github.v3+json');
												xhr4.send(JSON.stringify({
													message : commit.message,
													parents : commit.parents,
													tree : commit.tree
												}));
								
											}
										} else {
											commitResponse(xhr3.responseText);
										}
									}
								};
								xhr3.setRequestHeader('Authorization', 'Basic ' + authorization);
								xhr3.setRequestHeader('Accept', 'application/vnd.github.v3+json');
								xhr3.send();
							}
						} else {
							commitResponse(xhr2.responseText);
						}
					}
				};
				xhr2.setRequestHeader('Authorization', 'Basic ' + authorization);
				xhr2.setRequestHeader('Accept', 'application/vnd.github.v3+json');
				xhr2.send();
			} else {
				writeFileToCommit(commit);
			}
		}
	};
	xhr.setRequestHeader('Authorization', 'Basic ' + authorization);
	xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');
	xhr.send();
}


function writeFileToCommit(commit) {
	//let token = commit.token;
	let username = commit.username;
	let authorization = commit.authorization;
	let repository = commit.repository;
	let path = commit.path;
	let api = 'https://api.github.com/repos/'+encodeURI(username)+'/'+encodeURI(repository);
	
	let xhr = new XMLHttpRequest();
	xhr.open('PUT', api+'/contents/'+encodeURI(path), true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			if (xhr.responseText && xhr.responseText.length !== '') {
				let response = JSON.parse(xhr.responseText);
				commitResponse(response);
			}
		}
	};
	xhr.setRequestHeader('Authorization', 'Basic ' + authorization);
	xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');
	
	xhr.send(JSON.stringify({
		content : window.btoa(commit.content),
		message : commit.message,
		sha : commit.sha	
	}));
}

function commitResponse(response) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {committed: response}, function() {});
	});
}

function getImageData(url, width, height) {
	return new Promise(function(resolve){
		let img = document.createElement('img');
		let canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		let ctx = canvas.getContext('2d');
		img.onload = function(){
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			resolve(imgData);
		};
		img.src = url;
	});
}

function getUrlData(url, interval) {
	return new Promise(function(resolve,reject){
		if (interval
			&& parseInt(interval) > 0
		&& urlData[url]
		&& urlData[url].data
		&& urlData[url].lastUpdate
		&& (urlData[url].lastUpdate.getTime() + parseInt(interval)*1000) > new Date().getTime()) {
			resolve(urlData[url].data);
		} else {
			let xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == XMLHttpRequest.DONE) {
					if (xmlhttp.status == 200) {
						urlData[url] = {
							data: xmlhttp.responseText,
							lastUpdate : new Date()
						};
						resolve(urlData[url].data);
					}
					else if (xmlhttp.status == 400) {
						reject('There was an error 400');
					}
					else {
						reject('something else other than 200 was returned');
					}
				}
			};

			xmlhttp.open('GET', url, true);
			xmlhttp.send();
		}
	});
}

function upload(options) {
	if (options.service == 'imgur') {
		upload_imgur(options);
	}
}

function upload_imgur(options) {
	let fd = new FormData();
	fd.append('image', options.image.split(',')[1]);
	fd.append('name','WPSN');
	fd.append('title','WPSN');
	fd.append('description','Made with WebPageStickyNotes.com');
	let xhr = new XMLHttpRequest();

	xhr.open('POST', 'https://api.imgur.com/3/image', true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			if (xhr.responseText && xhr.responseText.length !== '') {
				let response = JSON.parse(xhr.responseText);
				response.service = 'imgur';
				log(response);
				chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.sendRequest(tab.id, {uploaded: response}, function() {});
				});
			}
		}
	};
	//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.setRequestHeader('Authorization', 'Client-id 69ac0147af1ea4b');
	xhr.send(fd);
}

chrome.runtime.onMessageExternal.addListener(function() {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {wpsn_recorder:true}, function() {});
	});
});

chrome.runtime.onInstalled.addListener(function(details) {
	if(details.reason == 'install'){
		log('This is a first install!');
		
	}else if(details.reason == 'update'){
		let thisVersion = chrome.runtime.getManifest().version;
		log('Updated from ' + details.previousVersion + ' to ' + thisVersion + '!');
		
	}
	chrome.storage.local.set({'wpsn-version':chrome.runtime.getManifest().version,'wpsn-version-previous':details.previousVersion,'wpsn-install-details': details});
	chrome.storage.local.remove('wpsn-version-updated');
});

function executeScripts(tabId)
{
	let manifest = chrome.runtime.getManifest();
	let js = ['jquery.js','marked.js','jquery-ui.js','jquery.colorPicker.js','tinymce/tinymce.min.js','tinymce/jquery.tinymce.min.js','tinymce/themes/modern/theme.min.js',/*"vis.min.js",*/'raphael-min.js','underscore-min.js',/*"sequence-diagram-min.js",*/'prettify/prettify.js','vkbeautify.js','steganography.js','jquery.dataTables.min.js','jquery.stickynotes.js'/*,"google.jsapi.js"*/];
	let css = ['jquery.stickynotes.rebase.css','jquery.stickynotes.css','jquery.colorPicker.css','tinymce/skins/lightgray/skin.min.css','tinymce/skins/lightgray/content.min.css',/*"vis.min.css",*/'prettify/prettify.css'];
	for(let i in manifest.content_scripts) {
		js = js.concat(manifest.content_scripts[i].js);
		css = css.concat(manifest.content_scripts[i].css);
	}

	function createJSCallback(tabId, injectDetails, innerCallback) {
		return function () {
			chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
		};
	}
	function createCSSCallback(tabId, injectDetails, innerCallback) {
		return function () {
			chrome.tabs.insertCSS(tabId, injectDetails, innerCallback);
		};
	}

	let callback = null;

	for (let i = js.length - 1; i >= 0; --i) {
		let details = {file:js[i],matchAboutBlank:true};
		callback = createJSCallback(tabId, details, callback);
	}

	for (let i = css.length - 1; i >= 0; --i) {
		let details = {file:css[i],matchAboutBlank:true};
		callback = createCSSCallback(tabId, details, callback);
	}


	//if (callback !== null)
	//callback();   // execute outermost function
}

let requests = {};
function tabChange(o1, o2, o3, o4, o5, tryAgain) {
	chrome.commands.getAll(function(commands){
		chrome.tabs.getSelected(null, function(tab){
			chrome.tabs.sendRequest(tab.id, {commands: commands}, function() {});
			updateCommands(commands);
		});
	});
	chrome.tabs.getSelected(null, function(tab) {
		requests[tab.id] = requests[tab.id] || {};
		if (!requests[tab.id].stickyCountRequest) {
			requests[tab.id].stickyCountRequest = true;
			chrome.tabs.sendRequest(tab.id, {stickyCountRequest:'true'}, function(response) {
				delete requests[tab.id].stickyCountRequest;
				if (response) {
					if (response.stickyCount === '0') {
						chrome.browserAction.setBadgeText({text: ''});
						//chrome.browserAction.setBadgeBackgroundColor({color: '#ffffaa'});
					} else {
						chrome.browserAction.setBadgeText({text: ''+response.stickyCount});
						chrome.browserAction.setBadgeBackgroundColor({color: '#ff0000'});
					}
				} else if ((tab.url.indexOf('http') == 0 || tab.url.indexOf('about') == 0) && !tryAgain) {
					executeScripts(tab.id);
					tabChange(o1, o2, o3, o4, o5, true);
				}
			});
		}
	});
}

/*chrome.contextMenus.create({
    "title": "Note Board",
    "contexts": ["browser_action"],
    "onclick" : function(info, tab){
		chrome.tabs.create({'url': chrome.extension.getURL('blank.html')}, function(tab) {});
	}
});*/


let shortcutConfig = {
	'a-c-manage-notes'								: { context : ['browser_action'] },
	'a-c-a-note-board'								: { context : ['browser_action', 'page'] },
	'a-c-b-sync-notes'								: { context : ['page'] },
	'a-c-c-sync-logout'								: { context : ['page'] },
	'a-d-settings'									: { context : ['browser_action'] },
	'a-e-about'										: { context : ['browser_action'] },
	'a-f-demo'										: { context : ['page'] },
	'a-a-undo'										: { context : ['browser_action', 'page'] },
	'a-b-redo'										: { context : ['browser_action', 'page'] },
	'a-g-backup'									: { context : ['browser_action', 'page'] },
	'a-a-add-note'									: { context : ['page'] },
	'a-g-goto-url'									: { context : ['page'] },
	'a-markdown-cheatsheet'							: { context : ['page'] },
	'a-tips-and-tricks'								: { context : ['page'] },
	'a-menu-cheatsheet'								: { context : ['page'] },
	'toggle-notes'									: { context : ['page'] },
	'b-select-all-notes'							: { context : ['page'] },
	'b-export-note'									: { context : ['page'] },
	'b-export-provided-notes'						: { context : ['page'] },
	'b-import-note'									: { context : ['page'] },
	'b-clone-note'									: { context : ['page'] },
	'b-clone-favorite-note'							: { context : ['page'] },
	'b-clone-provided-notes'						: { context : ['page'] },
	'b-copy-note'									: { context : ['page'] },
	'b-cut-note'									: { context : ['page'] },
	'b-copy-note-text'								: { context : ['page'] },
	'b-copy-note-html-text'							: { context : ['page'] },
	'b-copy-note-html-formatted-text'				: { context : ['page'] },
	'b-paste-copied-notes'							: { context : ['page'] },
	'b-paste-copied-notes-original-coordinates'		: { context : ['page'] },
	'b-commit-to-github'							: { context : ['page'] },
	//'b-compare-github-repos'						: { context : ['page'] },
	"b-stop-editing-note"							: { context : ['page'] },
	'c-add-media'									: { context : ['image','video','audio'] },
	'c-copy-media'									: { context : ['image','video','audio'] },
	//"share"										: { context : ["page","image","video","audio","link","selection"] },
	'c-add-rss'										: { context : ['page'] },
	'minimize-note'									: { context : ['page'] },
	'maximize-note'									: { context : ['page'] },
	'update-lookandfeel-note'						: { context : ['page'] },
	'update-mode-note'								: { context : ['page'] },
	'zoom-in-note'									: { context : ['page'] },
	'zoom-out-note'									: { context : ['page'] },	
	'zoom-on-note'									: { context : ['page'] },
	'create-checklist'							    : { context : ['page'] },
	'render- checklist'								: { context : ['page'] },
	'indent-prettify-note'							: { context : ['page'] },
	'minify-prettify-note'							: { context : ['page'] },
	'json-schema-viewer-note'					    : { context : ['page'] },
	'indent-minify-prettify-note-undo'				: { context : ['page'] },
	'bring-to-top-note'								: { context : ['page'] },
	'send-to-bottom-note'							: { context : ['page'] },
	'snapshot-note'									: { context : ['page'] },
	'position-note'									: { context : ['page'] },
	'position-notes-to-grid'						: { context : ['page'] },
	'remove-position-note'							: { context : ['page'] },
	'toggle-docking-note'							: { context : ['page'] },
	'toggle-canvas-mode-note'						: { context : ['page'] },
	'update-scope-note'								: { context : ['page'] },	
	'update-time-scope-note'						: { context : ['page'] },	
	'toggle-lock-note'								: { context : ['page'] },
	'delete-note'									: { context : ['page'] },
	'c-autofit-selected-notes'						: { context : ['page'] },
	'b-paste-clipboard-to-note'						: { context : ['page'] },
	'b-paste-formatted-clipboard-to-note'			: { context : ['page'] },
	'b-download-note-as-html'						: { context : ['page'] },
	'b-download-clipboard-as-html'					: { context : ['page'] },
	'b-paste-clipboard-to-note-prettify'			: { context : ['page'] },
	'b-deformat-clipboard'							: { context : ['page'] },
	'b-prettify-and-download-clipboard-as-html'		: { context : ['page'] },
	'b-smart-copy-to-clipboard'						: { context : ['selection'] },
	'b-copy-to-note'								: { context : ['selection'] },
	'b-copy-html-to-note'							: { context : ['selection'] },
	'b-copy-to-note-prettify'						: { context : ['selection'] },
	'b-prettify-and-download-as-html'				: { context : ['selection'] },
	'b-copy-link-and-text'							: { context : ['link'] }
};

chrome.commands.onCommand.addListener(function(command) {
	sendCommand(command);
});


function updateCommands(commandList) {
	commands = {};
	for (let i = 0; i < commandList.length; i++){
		let command = commandList[i];
		commands[command.name] = command;
		if (shortcutConfig[command.name]) {
			if (!shortcutConfig[command.name].init) {
				if (shortcutConfig[command.name] && shortcutConfig[command.name].context) {
					chrome.contextMenus.create({
						'id' : command.name,
						'title' : (command.description || command.name) + ' ' + shortcut(command.name,true),
						'contexts': shortcutConfig[command.name].context,
						'onclick' : function(info){
							sendCommand(info.menuItemId, info);
						}
					});
					shortcutConfig[command.name].init = true;
				} 
			} else if (shortcutConfig[command.name].init) {
				chrome.contextMenus.update(command.name, { title : (command.description || command.name) + ' ' + shortcut(command.name,true) });
			}
		}
	}
}

function getCommand(commandName) {
	return (commands||{})[commandName];
}
function shortcut(commandName,parenthesis) {
	let command = getCommand(commandName) || {};
	return command.shortcut && parenthesis ? '('+command.shortcut+')' : command.shortcut || '';
}
function sendCommand(commandName, options) {
	options = options || {};
	if (commandName == 'b-paste-copied-notes' || commandName == 'b-paste-copied-notes-original-coordinates') {
		options = { text : copied_notes };
	}
	chrome.tabs.getSelected(null, function(tab){
		chrome.tabs.sendRequest(tab.id, {command: commandName, options}, function() {});
	});
}

function log(msg, suppressed) {
	if (msg && !suppressed) {
		//eslint-disable-next-line no-console
		console.log(msg);
	}
}

function error(msg, suppressed) {
	if (msg && !suppressed) {
		//eslint-disable-next-line no-console
		console.err(msg);
	}
}
chrome.tabs.onCreated.addListener(tabChange);
chrome.tabs.onUpdated.addListener(tabChange);
chrome.tabs.onActivated.addListener(tabChange);
chrome.tabs.onHighlighted.addListener(tabChange);
chrome.tabs.onReplaced.addListener(tabChange);

//AIzaSyDyQPEu0OnLDrwCaqcRCk5ays8kXCCFYxQ