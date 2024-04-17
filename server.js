const express = require('express');
const mongoose = require('mongoose');
const DataModel = require('./models/sample.model');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors())

mongoose.connect('mongodb://localhost:27017/sample', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


app.get('/api/data/:start', async (req, res) => {

  const tempDate = req.params.start.split('T')[1].split(':');
  console.log(tempDate)
  let filterDate = new Date(req.params.start);
  console.log(filterDate.getTimezoneOffset())
  filterDate.setUTCHours(tempDate[0]);
  filterDate.setUTCMinutes(tempDate[1]);
  try {
    const filteredData = await DataModel.aggregate([
        {
          $addFields: {
            ts: {
              $dateFromString: {
                dateString: "$ts"
              }
            }
          }
        },
        {
          $match: {
            ts: {
              $gte: filterDate, 

            }
          }
        }
      ]);
    res.json(filteredData);
  } catch (error) {
    console.error('Error filtering data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/test',async(req,res)=>{
    const rows = await DataModel.find({});
    res.json({response : rows.length})
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
