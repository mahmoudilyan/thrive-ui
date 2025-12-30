import express from 'express';
import fs from 'fs';
import cors from 'cors';
import path from 'path';

const app = express();
const port = 3010;

// File cache to avoid reading from disk on every request
const fileCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in development

// Cached file reader with TTL
const readCachedFile = filePath => {
	const now = Date.now();
	const cached = fileCache.get(filePath);

	// Return cached version if it exists and is not expired
	if (cached && now - cached.timestamp < CACHE_TTL) {
		return Promise.resolve(cached.data);
	}

	// Read file and cache it
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) {
				reject(err);
				return;
			}

			try {
				const parsedData = JSON.parse(data);
				fileCache.set(filePath, {
					data: parsedData,
					timestamp: now,
				});
				resolve(parsedData);
			} catch (parseErr) {
				reject(parseErr);
			}
		});
	});
};

// Pre-load large frequently used files
const preloadFiles = [
	'./mock/contacts.json',
	'./mock/eventsList.json',
	'./mock/youtubeVideos.json',
	'./mock/lists-list-view.json',
	'./mock/instagramMessages.json',
	'./mock/messageStream.json',
];

// Preload files on server start
preloadFiles.forEach(filePath => {
	readCachedFile(filePath).catch(err =>
		console.warn(`Failed to preload ${filePath}:`, err.message)
	);
});

console.log('Preloading large mock files for better performance...');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
	cors({
		origin: ['http://localhost:3011', 'http://localhost:3000'],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	})
);

app.get('/App/Lists/GetListsList.json', async (req, res) => {
	try {
		const data = await readCachedFile('./mock/lists-all.json');
		res.json(data);
	} catch (err) {
		console.error('Error reading lists data:', err);
		res.status(500).send('Error reading data');
	}
});

// app.get('/api/getGoalsHeaders', (req, res) => {
//     fs.readFile('./mock/goals-load-headers.json', 'utf8', (err, data) => {
//         if (err) {
//           res.status(500).send('Error reading data');
//           return;
//         }
//         console.log(data);
//         res.json(JSON.parse(data));
//       });
// })
app.get('/App/Domains/GetDomains.json', (req, res) => {
	fs.readFile('./mock/domains.json', 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading data');
			return;
		}
		res.json(JSON.parse(data));
	});
});

app.post('/App/Contacts/GetContacts.json', async (req, res) => {
	const { loadheaders } = req.query;

	try {
		if (loadheaders) {
			console.log('Loading headers');
			const data = await readCachedFile('./mock/contact-load-headers.json');
			res.json(data);
			return;
		}

		const data = await readCachedFile('./mock/contacts.json');
		res.json(data);
	} catch (err) {
		console.error('Error reading contacts data:', err);
		res.status(500).send('Error reading data');
	}
});

app.post('/App/Contacts/GetDefaultFields.json', (req, res) => {
	fs.readFile('./mock/contact-fields.json', 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading data');
			return;
		}
		res.json(JSON.parse(data));
	});
});

app.get('/App/Contacts/GetAllFields.json', (req, res) => {
	fs.readFile('./mock/contact-fields.json', 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading data');
			return;
		}
		res.json(JSON.parse(data));
	});
});

app.post('/App/Lists/GetLists.json', async (req, res) => {
	const { view, loadheaders } = req.query;

	try {
		if (loadheaders) {
			console.log('Loading headers');
			const data = await readCachedFile('./mock/list-load-headers.json');
			res.json(data);
			return;
		}

		if (view === 'folder') {
			// Get the folderId from the form
			if (!req.body.folderid) {
				const data = await readCachedFile('./mock/lists-folder-view.json');
				res.json(data);
				return;
			}
			const data = await readCachedFile(`./mock/lists-folder-${req.body.folderid}.json`);
			res.json(data);
		} else {
			const data = await readCachedFile('./mock/lists-list-view.json');
			res.json(data);
		}
	} catch (err) {
		console.error('Error reading lists data:', err);
		res.status(500).send('Error reading data');
	}
});

app.post('/App/Goals/GetGoals.json', (req, res) => {
	const { view, loadheaders } = req.query;
	if (loadheaders) {
		fs.readFile('./mock/goals-load-headers.json', 'utf8', (err, data) => {
			if (err) {
				res.status(500).send('Error reading data');
				return;
			}
			res.json(JSON.parse(data));
		});
		return;
	}
	console.log('Search Term: ', req.body);

	if (view === 'folder') {
		// Get the folderId from the form
		if (!req.body.folderid) {
			fs.readFile('./mock/goals-folder-view.json', 'utf8', (err, data) => {
				if (err) {
					res.status(500).send('Error reading data');
					return;
				}
				res.json(JSON.parse(data));
			});
			return;
		}
		fs.readFile(`./mock/goals-folder-22.json`, 'utf8', (err, data) => {
			if (err) {
				res.status(500).send('Error reading data');
				return;
			}
			res.json(JSON.parse(data));
		});
		return;
	} else {
		fs.readFile('./mock/goals-list-view.json', 'utf8', (err, data) => {
			if (err) {
				res.status(500).send('Error reading data');
				return;
			}
			res.json(JSON.parse(data));
		});
	}
});

// Add id and type as variables to the URL
app.post('/App/Folders/RemoveFolder.json', (req, res) => {
	console.log(req.params);
	// Wait for 1 second before sending the response
	setTimeout(() => {
		res.json({
			deleted: true,
			messageTitle: 'All done!',
			message:
				'Your folder has been removed from your account successfully and currently floating in a digital heaven :-)',
			status: 'success',
		});
	}, 1000);
});

app.post('/App/Folders/CreateFolder.json', (req, res) => {
	const { type } = req.query;
	console.log('Body: ', req.body);
	console.log('Create Folder: ', type);
	console.log(req.body);
	fs.readFile('./mock/create-folder.json', 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading data');
			return;
		}
		res.json(JSON.parse(data));
	});
});

app.get('/App/Tasks/GetTasks.json', (req, res) => {
	console.log('Gettings tasks');
	fs.readFile('./mock/tasks-list.json', 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading data');
			return;
		}
		res.json(JSON.parse(data));
	});
});

app.post('/App/Tasks/AddNewAsset.json', (req, res) => {
	const { assetsIds, assetType } = req.body;
	console.log('Body: ', req.body);
	res.json({
		assets: [],
		message:
			'Some of the Assets you attempted to add already exist. The others are added successfully!',
		status: 'success',
	});
});

app.post('/App/CampaignAssets/GetAssetGroups.json', (req, res) => {
	const { loadheaders } = req.query;
	console.log('Gettings asset groups');
	if (loadheaders) {
		fs.readFile('./mock/assets-group-headers.json', 'utf8', (err, data) => {
			if (err) {
				res.status(500).send('Error reading data');
				return;
			}
			res.json(JSON.parse(data));
		});
		return;
	}
	fs.readFile(`./mock/assets-group.json`, 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading data');
			return;
		}
		res.json(JSON.parse(data));
	});
});

app.post('/App/CampaignAssets/AttachToAssetGroup.json', (req, res) => {
	const { id, assetType } = req.body;
	console.log('Body: ', id, assetType, req.body);
	res.json({
		message: 'Your campaigns has been updated successfully.',
		status: 'success',
	});
});

app.post('/App/Goals/DeleteGoal.json', (req, res) => {
	const { id, __confirm } = req.body;
	console.log('Body: ', id, __confirm);
	res.json({
		deleted: true,
		messageTitle: 'All done!',
		message:
			'Your goal has been removed successfully and currently floating in a digital heaven :-)',
		status: 'success',
	});
	return;
});

app.post('/App/Audiences/GetAudiences.json', (req, res) => {
	const { loadheaders, view } = req.query;
	if (loadheaders) {
		console.log(req.body);
		fs.readFile('./mock/audience-load-headers.json', 'utf8', (err, data) => {
			if (err) {
				res.status(500).send('Error reading data');
				return;
			}
			res.json(JSON.parse(data));
		});
		return;
	}
	if (view === 'folder') {
		if (req.body.folderid) {
			fs.readFile(`./mock/audience-single-folder-view.json`, 'utf8', (err, data) => {
				if (err) {
					res.status(500).send('Error reading data');
					return;
				}
				res.json(JSON.parse(data));
			});
		} else {
			fs.readFile('./mock/audience-folder-view.json', 'utf8', (err, data) => {
				if (err) {
					res.status(500).send('Error reading data');
					return;
				}
				res.json(JSON.parse(data));
			});
		}
	} else {
		fs.readFile('./mock/audience-list-view.json', 'utf8', (err, data) => {
			if (err) {
				res.status(500).send('Error reading data');
				return;
			}
			res.json(JSON.parse(data));
		});
		return;
	}
});

app.post('/App/Folders/GetFolders.json', (req, res) => {
	if (req.query.loadheaders) {
		fs.readFile('./mock/get-folders-headers.json', 'utf8', (err, data) => {
			if (err) {
				res.status(500).send('Error reading data');
				return;
			}
			console.log(JSON.parse(data));
			res.json(JSON.parse(data));
			return;
		});
		return;
	}
	fs.readFile('./mock/get-folders.json', 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading data');
			return;
		}
		res.json(JSON.parse(data));
	});
});

app.post('/App/Folders/UpdateFolder.json', (req, res) => {
	const { id, type } = req.query;
	res.json({
		id: id,
		name: 'another testing folder 2',
		message: 'Your folder has been renamed successfully',
		status: 'success',
	});
	return;
});

app.post('/App/EmailMarketing/GetCampaigns.json', (req, res) => {
	const { view, loadheaders } = req.query;
	if (loadheaders) {
		fs.readFile('./mock/campaigns-load-headers.json', 'utf8', (err, data) => {
			if (err) {
				res.status(500).send('Error reading data');
				return;
			}
			res.json(JSON.parse(data));
		});
		return;
	}

	if (view === 'folder') {
		if (req.body.folderid) {
			fs.readFile(`./mock/campaigns-single-folder-view.json`, 'utf8', (err, data) => {
				if (err) {
					res.status(500).send('Error reading data');
					return;
				}
				res.json(JSON.parse(data));
			});
		} else {
			fs.readFile('./mock/campaigns-folder-view.json', 'utf8', (err, data) => {
				if (err) {
					res.status(500).send('Error reading data');
					return;
				}
				res.json(JSON.parse(data));
			});
		}
	} else {
		fs.readFile('./mock/campaigns-list-view.json', 'utf8', (err, data) => {
			if (err) {
				res.status(500).send('Error reading data');
				return;
			}
			res.json(JSON.parse(data));
		});
	}
});

app.post('/App/Templates/GetTemplates.json', (req, res) => {
	const { view, loadheaders } = req.query;
	if (loadheaders) {
		fs.readFile('./mock/templates-headers.json', 'utf8', (err, data) => {
			if (err) {
				res.status(500).send('Error reading data');
				return;
			}
			res.json(JSON.parse(data));
		});
		return;
	}

	if (view === 'folder') {
		if (req.body.folderid) {
			fs.readFile(`./mock/templates-single-folder-view.json`, 'utf8', (err, data) => {
				if (err) {
					res.status(500).send('Error reading data');
					return;
				}
				res.json(JSON.parse(data));
			});
		} else {
			fs.readFile('./mock/templates-folder-view.json', 'utf8', (err, data) => {
				if (err) {
					res.status(500).send('Error reading data');
					return;
				}
				res.json(JSON.parse(data));
			});
		}
	} else {
		fs.readFile('./mock/templates-list-view.json', 'utf8', (err, data) => {
			if (err) {
				res.status(500).send('Error reading data');
				return;
			}
			res.json(JSON.parse(data));
		});
	}
});

// Social Media Endpoints
app.get('/App/SocialMedia/GetChannels.json', (req, res) => {
	fs.readFile('./mock/accountsAndGroups.json', 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading data');
			return;
		}
		res.json(JSON.parse(data));
	});
});

app.get('/App/SocialStreams/ChannelTabs.json', (req, res) => {
	const { channel } = req.query;

	// Determine which JSON file to use based on channel parameter
	let jsonFile = 'channelTabs.json';

	if (channel === 'instagram:search') {
		jsonFile = 'instagramSearch.json';
	} else if (channel === 'youtube:search') {
		jsonFile = 'youtubeSearch.json';
	} else if (channel && channel.startsWith('group:')) {
		// For group channels, use groupTabs.json
		jsonFile = 'groupTabs.json';
	} else if (channel && channel.includes(':')) {
		// For individual channel channels, use channelTabs.json
		jsonFile = 'channelTabs.json';
	}

	fs.readFile(`./mock/${jsonFile}`, 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading data');
			return;
		}
		res.json(JSON.parse(data));
	});
});

app.get('/App/Calendar/EventsList.json', (req, res) => {
	fs.readFile('./mock/eventsList.json', 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading data');
			return;
		}
		res.json(JSON.parse(data));
	});
});

app.get('/App/SocialStreams/Stream.json', (req, res) => {
	const { channel, tabid } = req.query;

	// Map stream types to their respective JSON files
	const streamFileMap = {
		feeds: 'newsFeeds.json',
		directmessages: 'messageStream.json',
		messages: 'messageStream.json',
		taggedposts: 'taggedStream.json',
		tags: 'taggedStream.json',
		reviews: 'reviewsStream.json',
		ads: 'adsFeed.json',
		videos: 'youtubeVideos.json',
		published_comments: 'youtubePublishedComments.json',
		moderate_comments: 'youtubeModernComments.json',
		playlist: 'youtubePlaylist.json',
		comment: 'instagramPosts.json',
		posts: 'linkedInFeed.json',
		search: 'youtubeSearch.json',
	};

	// Default file based on tabid
	let jsonFile = streamFileMap[tabid] || 'newsFeeds.json';

	// Override based on channel type
	if (channel && channel.includes('instagram')) {
		if (tabid === 'tags') jsonFile = 'instagramTagged.json';
		else if (tabid === 'messages') jsonFile = 'instagramMessages.json';
		else if (tabid === 'search') jsonFile = 'instagramHash.json';
		else if (tabid === 'comment') jsonFile = 'instagramPosts.json';
	} else if (channel && channel.includes('tiktok')) {
		if (tabid === 'videos') jsonFile = 'tiktokFeed.json';
	} else if (channel && channel.includes('twilio')) {
		if (tabid === 'messages') jsonFile = 'twilioMessages.json';
	} else if (channel && channel.includes('pinterest')) {
		if (tabid === 'feeds') jsonFile = 'pinterestFeed.json';
	} else if (channel && channel.includes('googlebusiness')) {
		if (tabid === 'reviews') jsonFile = 'googleBusinessReviews.json';
	}

	fs.readFile(`./mock/${jsonFile}`, 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading data');
			return;
		}
		res.json(JSON.parse(data));
	});
});

app.get('/App/SocialStreams/FacebookComments.json', (req, res) => {
	fs.readFile('./mock/facebookComments.json', 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading data');
			return;
		}
		res.json(JSON.parse(data));
	});
});

app.post('/App/SocialStreams/AddFacebookComment.json', (req, res) => {
	// Mock response for adding comments
	res.json({
		status: 'success',
		message: 'Comment added successfully',
	});
});

app.post('/App/SocialStreams/LikeComment.json', (req, res) => {
	// Mock response for liking comments
	res.json({
		status: 'success',
		message: 'Comment liked successfully',
	});
});

app.post('/App/SocialMedia/CreateShortlink.json', (req, res) => {
	// Mock response for creating short links
	res.json({
		status: 'success',
		shortUrl: 'https://short.ly/abc123',
		originalUrl: req.body.url,
	});
});

app.post('/App/SocialMedia/TextCrawler.json', (req, res) => {
	// Mock response for text crawler
	res.json({
		status: 'success',
		links: [],
		text: req.body.text,
	});
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
