# News Page Management

This news page is now fully dynamic! A novice can easily update content by editing the `news-data.json` file.

## How to Update Content

### 1. Latest Updates Section
Edit the `latestUpdates` array in `news-data.json`:
```json
{
  "title": "Your Update Title",
  "date": "Month DD, YYYY",
  "description": "Brief description of the update",
  "link": "URL or # for placeholder"
}
```

### 2. Stories from the Field Section
Edit the `stories` array in `news-data.json`:
```json
{
  "icon": "cow|users|dollar-sign|leaf",
  "title": "Story Title",
  "description": "Brief description",
  "link": "URL or # for placeholder"
}
```

### 3. Press Coverage Section
Edit the `pressCoverage` array in `news-data.json`:
```json
{
  "source": "Publication Name",
  "title": "Article Title",
  "link": "URL to article"
}
```

## Available Story Icons
- `cow` - For dairy/farming stories
- `users` - For community/people stories
- `dollar-sign` - For business/economic stories
- `leaf` - For environmental/climate stories

## Instructions for Novice Users
1. Open `news-data.json` in any text editor
2. Find the section you want to update
3. Copy an existing entry and modify the values
4. Save the file
5. Refresh the news page in your browser to see changes

No coding knowledge required! Just edit the JSON file with your content.