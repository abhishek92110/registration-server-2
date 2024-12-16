const { GoogleSpreadsheet } = require('google-spreadsheet');
const google = require("googleapis");
const express = require("express");
const mongoose = require('mongoose')
const router = express.Router();
const app = express();
const XLSX = require('xlsx');
const uploadFile = require("../middleware/upload");
const users = require("../models/userSchema");
const oldStudent = require("../models/OldStudent");
const oldCounselor = require("../models/OldCounselor")
const document = require("../models/Document");
const trainer = require("../models/teachermodal");
const oldtrainer = require("../models/OldTrainer");
const StudentFee = require("../models/FeeSchema");
const uploaditem = require("../models/UploadedItem");
const submititem = require("../models/Submitteditem");
const messagemodel = require("../models/Messagemodel");
const Studentmessagemodel = require("../models/StudentMessage");
const runningBatches = require("../models/RunningBatch");
const deletedBatches = require("../models/DeletedBatch");
const FixDemo = require("../models/FixDemo");
const NewDemo = require("../models/DemoList");
const DemoStudent = require("../models/DemoStudent");
const totalRegistration = require("../models/TotalRegistrationNo");
const counsellortotallead= require("../models/CounsellorTotalLead");
const inst = require("../models/inst");
const DataModel = require('../models/filterdata');
const multer = require("multer");
const bodyParser = require('body-parser');
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const fs = require("fs");
const path = require('path');
const admins = require("../models/Admin")
const attendance = require("../models/Attendance")
const Studentattendance = require("../models/StudentAttendance")
const compiler = require('compilex');
const batches = require("../models/BatchCourse");
const subCourse = require("../models/Subcourse");
const runningBatch = require("../models/RunningBatch");
const registerStudent = require("../models/RegisteredStudent");
const registerStudentDev = require("../models/RegisterStudentDev");
const counselors = require("../models/Counselor")
const adData = require("../models/AdData")
const counselorsdemo = require("../models/CounselorDemo")
const demoReschedule = require("../models/DemoReschedule")
const counselorsfollowUp = require("../models/CounselorFollowUp")
const counselorsvisit = require("../models/CounselorVisit")
// const uploadfiles = require('../models/UploadedItem')
const uploadclassurl = require('../models/UploadClassUrl')
const uploadvideourl = require('../models/VideoUrl')
const Notes = require('../models/Notes')
const options = { stats: true }
compiler.init(options)
const { JWT } = require('google-auth-library');

const counselorLead = require("../models/CounselorLead");
const RescheduleDemo = require('../models/DemoReschedule');
const counselorDemo = require('../models/CounselorDemo');
const Expiry  =  require("../models/Expiry")
const latestData  =  require("../models/LatestData")

const jwt_secret = "uuu"

// home route


router.get('/',async(req,res)=>{
    res.send({"status":"running"})
})


router.get('/allSubMainCourse',async(req,res)=>{  
    
    // console.log("all sub main course func =")
    let allCourse = await subCourse.find()

    let courses =[]
    allCourse.map(data=>{

        data.subCourse.map(element=>{
            courses.push(element)
        })
    
    })
    let maincourses =[]

    allCourse.map(data=>{
            maincourses.push(data.mainCourse)       
    
    })
        res.send({courses:courses,mainCourse:maincourses,allCourse:allCourse})
})


router.get("/getregisterStudentMonth", async (req, res) => {

    const currentMonth = req.header("month")

    try {
        const userdata = await registerStudentDev.find({month:currentMonth});
        res.status(200).json(userdata);
    } catch (error) {
        console.log('error =', error.message)
        res.status(500).json(error);
    }
});

router.get('/getfacebookLeadData', async (req, res) => {
    const accessToken = 'EAALgVEQc5iQBO1ZCSJPlFaZCXtMnE2CZBhtGMSZBsfhjpB9p0tQXtPQthB6xg8TXl9b3WnejWo4NN8Y0m6W9pNsjqkGGaS9wWDKHXsomZCGu7zaOqK8SBQVIPlrOsIS3UiuSnPscZBEZAhCn0NhTHoZCs6223CPx1quZBX8PnWa6mzyZBBOPQt83ZBTpE4s';
    let allLeads = [];
    let id = req.header("id")
    console.log("facebook lead data =",id)
    let nextPageUrl = `https://graph.facebook.com/v14.0/${id}/leads?fields=id,name,field_data,created_time&access_token=${accessToken}`;

    try {
        while (nextPageUrl) {
            let response = await fetch(nextPageUrl);
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }
            let data = await response.json();

            if (data && data.data) {
                allLeads.push(...data.data);
            }

            // Check if there is a next page
            nextPageUrl = data.paging ? data.paging.next : null;
        }

        res.send({length: allLeads.length, data: allLeads  });
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).send({ error: 'Failed to fetch leads data.' });
    }
});

// get facebook ads form data date wise

router.get('/getRangefacebookLeadData', async (req, res) => {
    const accessToken = 'EAALgVEQc5iQBO1ZCSJPlFaZCXtMnE2CZBhtGMSZBsfhjpB9p0tQXtPQthB6xg8TXl9b3WnejWo4NN8Y0m6W9pNsjqkGGaS9wWDKHXsomZCGu7zaOqK8SBQVIPlrOsIS3UiuSnPscZBEZAhCn0NhTHoZCs6223CPx1quZBX8PnWa6mzyZBBOPQt83ZBTpE4s';
    let allLeads = [];
    const id = req.header("id")
    console.log("id of ad =",id)
    let nextPageUrl = `https://graph.facebook.com/v14.0/${id}/leads?fields=id,name,field_data,created_time&access_token=${accessToken}`;

    try {

        while (nextPageUrl)
             {
            let response = await fetch(nextPageUrl);
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }
            let data = await response.json();

            if (data && data.data) {
                allLeads.push(...data.data);
            }

            // Check if there is a next page
            nextPageUrl = data.paging ? data.paging.next : null;
        }

        // Filter leads by date if 'startDate' and 'endDate' query parameters are provided
        const startDate  = req.header("startDate");
        const endDate  = req.header("endDate");
        console.log("start and enddate =",startDate, endDate, id)
        let filteredLeads = allLeads;

        if (startDate || endDate) 
            {
            filteredLeads = allLeads.filter(lead => {
                const createdTime = new Date(lead.created_time);
                return (!startDate || createdTime >= new Date(startDate)) &&
                       (!endDate || createdTime <= new Date(endDate));
            });

            filteredLeads = filteredLeads.map(data=>{
                let obj = {}
                for(const a in data){
                    obj[a]= data[a]
                }
                obj.status =""
                return obj
            })
        }

        res.send({ length: filteredLeads.length, data: filteredLeads, adId:id});
    } 
    catch (error) 
    {
        console.error('Error fetching leads:', error);
        res.status(500).send({ error: 'Failed to fetch leads data.' });
    }
});

// get facebook campaign data

// router.get('/getfacebookCampaignData', async (req, res) => 
//     {
//     // const accessToken = 'EAALgVEQc5iQBO1ZCSJPlFaZCXtMnE2CZBhtGMSZBsfhjpB9p0tQXtPQthB6xg8TXl9b3WnejWo4NN8Y0m6W9pNsjqkGGaS9wWDKHXsomZCGu7zaOqK8SBQVIPlrOsIS3UiuSnPscZBEZAhCn0NhTHoZCs6223CPx1quZBX8PnWa6mzyZBBOPQt83ZBTpE4s';
//     const accessToken = 'EAALgVEQc5iQBO6kcRZB1CppyuruzYQENhuk4XGiouHAijriRIFWLh3ZCl4SQKaJ3mygAnFDZB6OQX0UpDWJ0MWAGQiQTDZA9ZB8ohotyrmUrwxqIhjzVIVSh3cSXfHidYUJpUyF3LRPrL9O4TNZAf4r7elbi1BNtj71u08xZCmqoh5ZBotJKOZAIlsSKq';
//     let allCampaigns = [];
//     // let nextPageUrl = `https://graph.facebook.com/v20.0/act_351689515/campaigns?fields=id,name,status,created_time&access_token=${accessToken}`;
//     let nextPageUrl = `https://graph.facebook.com/v20.0/act_2516170511788376/campaigns?fields=id,name,status,created_time&access_token=${accessToken}`;

//     let count =0;
//     try {
//         while (nextPageUrl) {
//             count = count + 1;
//             console.log("count -",count)
//             let response = await fetch(nextPageUrl);
//             if (!response.ok) {
//                 throw new Error(`Error fetching data: ${response.statusText}`);
//             }
//             let data = await response.json();

//             if (data && data.data) {
//                 // Filter campaigns with 'ACTIVE' status
//                 const activeCampaigns = data.data.filter(campaign => campaign.status === 'ACTIVE');
//                 // const activeCampaigns = data.data
//                 allCampaigns.push(...activeCampaigns);
//             }

//             // Check if there is a next page
//             nextPageUrl = data.paging ? data.paging.next : null;
//         }

//         res.send({ length: allCampaigns.length, data: allCampaigns });
//     } 
//     catch (error) {
//         console.error('Error fetching campaigns:', error);
//         res.status(500).send({ error: 'Failed to fetch campaigns data.' });
//     }
// }
// );


router.get('/getfacebookCampaignData', async (req, res) => {
    const accessToken = 'EAALgVEQc5iQBO6kcRZB1CppyuruzYQENhuk4XGiouHAijriRIFWLh3ZCl4SQKaJ3mygAnFDZB6OQX0UpDWJ0MWAGQiQTDZA9ZB8ohotyrmUrwxqIhjzVIVSh3cSXfHidYUJpUyF3LRPrL9O4TNZAf4r7elbi1BNtj71u08xZCmqoh5ZBotJKOZAIlsSKq';
    const adAccounts = [ 'act_351689515','act_2516170511788376'];
    let allCampaigns = [];

    try {
        for (let adAccountId of adAccounts) {
            let nextPageUrl = `https://graph.facebook.com/v20.0/${adAccountId}/campaigns?fields=id,name,status,created_time&access_token=${accessToken}`;

            while (nextPageUrl) {
                let response = await fetch(nextPageUrl);
                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.statusText}`);
                }

                let data = await response.json();

                if (data && data.data) {
                    // Filter campaigns with 'ACTIVE' status
                    const activeCampaigns = data.data.filter(campaign => campaign.status === 'ACTIVE');
                    allCampaigns.push(...activeCampaigns);
                }

                // Check if there is a next page
                nextPageUrl = data.paging ? data.paging.next : null;
            }
        }

        res.send({ length: allCampaigns.length, data: allCampaigns });
        return { length: allCampaigns.length, data: allCampaigns };
    } 
    catch (error) {
        console.error('Error fetching campaigns:', error);
        res.status(500).send({ error: 'Failed to fetch campaigns data.' });
    }
});


const getAllCampaign = async()=>{
    
}




// get latest facebook data

// router.get('/getLatestFacebookAdData', async (req, res) => {
//     const accessToken = 'EAALgVEQc5iQBO1ZCSJPlFaZCXtMnE2CZBhtGMSZBsfhjpB9p0tQXtPQthB6xg8TXl9b3WnejWo4NN8Y0m6W9pNsjqkGGaS9wWDKHXsomZCGu7zaOqK8SBQVIPlrOsIS3UiuSnPscZBEZAhCn0NhTHoZCs6223CPx1quZBX8PnWa6mzyZBBOPQt83ZBTpE4s';
//     let allData = [];
//     let nextPageUrl = `https://graph.facebook.com/v20.0/act_351689515/campaigns?fields=id,name,status&access_token=${accessToken}`;

//     // Helper function to fetch with retry logic
//     const fetchWithRetry = async (url, retries = 3) => {
//         for (let i = 0; i < retries; i++) {
//             try {
//                 let response = await fetch(url);
//                 if (response.ok) {
//                     return response;
//                 }
//                 const errorText = await response.text();
//                 console.error(`Fetch error: ${errorText}`);
//                 throw new Error(`Fetch error: ${response.statusText}`);
//             } catch (error) {
//                 if (i < retries - 1) {
//                     await new Promise(res => setTimeout(res, 2 ** i * 1000)); // Exponential backoff
//                 } else {
//                     throw error;
//                 }
//             }
//         }
//     };

//     try {
//         while (nextPageUrl) {
//             let response = await fetchWithRetry(nextPageUrl);
//             let data = await response.json();

//             if (data && data.data) {
//                 // Filter campaigns with 'ACTIVE' status
//                 const activeCampaigns = data.data.filter(campaign => campaign.status === 'ACTIVE');

//                 for (let campaign of activeCampaigns) {
//                     try {
//                         // Get ads for each campaign
//                         let adsUrl = `https://graph.facebook.com/v20.0/${campaign.id}/ads?fields=id,name&access_token=${accessToken}`;
//                         let adsResponse = await fetchWithRetry(adsUrl);
//                         let adsData = await adsResponse.json();

//                         if (adsData && adsData.data) {
//                             for (let ad of adsData.data) {
//                                 try {
//                                     // Get leads for each ad
//                                     let leadsUrl = `https://graph.facebook.com/v20.0/${ad.id}/leads?fields=id,field_data,created_time&access_token=${accessToken}&limit=10`;
//                                     let leadsResponse = await fetchWithRetry(leadsUrl);
//                                     let leadsData = await leadsResponse.json();

//                                     if (leadsData && leadsData.data) {
//                                         for (let lead of leadsData.data) {
//                                             allData.push({
//                                                 data_id: lead.id,
//                                                 field_data: lead.field_data,
//                                                 created_time: lead.created_time,
//                                                 ad_id: ad.id,
//                                                 ad_name: ad.name,
//                                                 campaign_id: campaign.id,
//                                                 campaign_name: campaign.name
//                                             });
//                                         }
//                                     }
//                                 } catch (error) {
//                                     console.error(`Failed to fetch leads for ad ${ad.id}: ${error.message}`);
//                                 }
//                             }
//                         }
//                     } catch (error) {
//                         console.error(`Failed to fetch ads for campaign ${campaign.id}: ${error.message}`);
//                     }
//                 }
//             }

//             // Check if there is a next page
//             nextPageUrl = data.paging ? data.paging.next : null;
//         }

//         res.send({ length: allData.length, data: allData });
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         res.status(500).send({ error: 'Failed to fetch data.' });
//     }
// });

// get latest facebook data second time

// router.get('/getLatestFacebookAdData', async (req, res) => 
//     {
//     // const accessToken = 'EAALgVEQc5iQBO1ZCSJPlFaZCXtMnE2CZBhtGMSZBsfhjpB9p0tQXtPQthB6xg8TXl9b3WnejWo4NN8Y0m6W9pNsjqkGGaS9wWDKHXsomZCGu7zaOqK8SBQVIPlrOsIS3UiuSnPscZBEZAhCn0NhTHoZCs6223CPx1quZBX8PnWa6mzyZBBOPQt83ZBTpE4s';
//     const accessToken = 'EAALgVEQc5iQBO6kcRZB1CppyuruzYQENhuk4XGiouHAijriRIFWLh3ZCl4SQKaJ3mygAnFDZB6OQX0UpDWJ0MWAGQiQTDZA9ZB8ohotyrmUrwxqIhjzVIVSh3cSXfHidYUJpUyF3LRPrL9O4TNZAf4r7elbi1BNtj71u08xZCmqoh5ZBotJKOZAIlsSKq';
//     let allData = [];
//     let nextPageUrl = `https://graph.facebook.com/v20.0/act_351689515/campaigns?fields=id,name,status&access_token=${accessToken}`;

//     const fetchWithRetry = async (url, retries = 3) => {
//         for (let i = 0; i < retries; i++) 
//             {
//             try {
//                 let response = await fetch(url);
//                 if (response.ok) {
//                     return response;

//                 }
//                 const errorText = await response.text();
//                 console.error(`Fetch error: ${errorText}`);
//                 throw new Error(`Fetch error: ${response.statusText}`);
//             } catch (error) {
//                 if (i < retries - 1) {
//                     await new Promise(res => setTimeout(res, 2 ** i * 1000));
//                 } else {
//                     throw error;
//                 }
//             }
//         }
//     };

//     const now = new Date();
//     const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    
//     try {
        
//         let activeCampaigns  = await fetch(`http://localhost:8000/getfacebookCampaignData`)
//         activeCampaigns = await activeCampaigns.json();
//         console.log("active campaign =",activeCampaigns.length)
//         activeCampaigns = activeCampaigns.data
//         activeCampaigns = activeCampaigns.filter(data=>{
//             return(
//                 data.status=="ACTIVE"
//             )
//         })

//         let campaignName = activeCampaigns.map(data=>{
//             return(
//                 data.name
//             )
//         })

//         console.log("campaign name =",campaignName)
//         // const activeCampaigns = campaignData.data.filter(campaign => campaign.status === 'ACTIVE');

//             if (activeCampaigns) 
//                 {
//                 console.log(" if data condition ")
//                 let count = 0;
//                 for (let campaign of activeCampaigns) {
//                     count = count + 1;
//                     console.log("api calling ",count, activeCampaigns.length)
//                     try {
//                         let adsUrl = `https://graph.facebook.com/v20.0/${campaign.id}/ads?fields=id,name&access_token=${accessToken}`;
//                         let adsResponse = await fetchWithRetry(adsUrl);
//                         let adsData = await adsResponse.json();

//                         console.log("ad length =",adsData.data.length)

//                         if (adsData && adsData.data) 
//                             {
//                             for (let ad of adsData.data) {
//                                 try {
//                                     let leadsUrl = `https://graph.facebook.com/v20.0/${ad.id}/leads?fields=id,field_data,created_time&access_token=${accessToken}&limit=100`;
//                                     let leadsResponse = await fetchWithRetry(leadsUrl);
                                    
//                                     let leadsData = await leadsResponse.json();
//                                     console.log("length of leads data =",leadsData.data.length)

//                                     if (leadsData && leadsData.data) {
//                                         for (let lead of leadsData.data) {
//                                             const leadCreatedTime = new Date(lead.created_time);
//                                             if (leadCreatedTime > oneDayAgo) {
//                                                 allData.push({
//                                                     data_id: lead.id,
//                                                     field_data: lead.field_data,
//                                                     created_time: lead.created_time,
//                                                     ad_id: ad.id,
//                                                     ad_name: ad.name,
//                                                     campaign_id: campaign.id,
//                                                     campaign_name: campaign.name,
//                                                     counsellorNo:"",
//                                                     counsellorName:""
//                                                 });
//                                             }
//                                         }
//                                     }
//                                 } catch (error) {
//                                     console.error(`Failed to fetch leads for ad ${ad.id}: ${error.message}`);
//                                 }
//                             }
//                         }
//                     } catch (error) {
//                         console.error(`Failed to fetch ads for campaign ${campaign.id}: ${error.message}`);
//                     }
//                 }
//             }        

//         res.send({ length: allData.length, data: allData });
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         res.status(500).send({ error: 'Failed to fetch data.' });
//     }
// });

router.get('/getLatestFacebookAdData', async (req, res) => {
    const accessToken = 'EAALgVEQc5iQBO6kcRZB1CppyuruzYQENhuk4XGiouHAijriRIFWLh3ZCl4SQKaJ3mygAnFDZB6OQX0UpDWJ0MWAGQiQTDZA9ZB8ohotyrmUrwxqIhjzVIVSh3cSXfHidYUJpUyF3LRPrL9O4TNZAf4r7elbi1BNtj71u08xZCmqoh5ZBotJKOZAIlsSKq'; // Replace with your actual access token
    let allData = [];
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    let filterDate = oneDayAgo.toISOString().split('T')[0];
    console.log("oneDayAgo =",oneDayAgo,filterDate, filterDate+1)

    let filterDateObj = new Date(filterDate);

// Increment by one day
filterDateObj.setDate(filterDateObj.getDate() + 1);

// Convert the incremented date back to a string in 'YYYY-MM-DD' format
    let nextDayFilterDate = filterDateObj.toISOString().split('T')[0]; 
    let fetchedcampaignCount = 1;

    console.log("api to count to call campaign = ",fetchedcampaignCount)
    fetchedcampaignCount = fetchedcampaignCount+1
    // Fetch active campaigns from the local server
    let activeCampaignsResponse = await fetch('https://blockey.in:8000/getfacebookCampaignData');
    let activeCampaigns = await activeCampaignsResponse.json();
    activeCampaigns = activeCampaigns.data
    console.log("Active campaigns fetched:", activeCampaigns.length);

    const fetchWithRetry = async (url, retries = 3, delayTime = 3000) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    return response;
                } else {
                    const errorText = await response.text();
                    console.error(`Fetch error: ${errorText}`);
                    throw new Error(`Fetch error: ${response.statusText}`);
                }
            } catch (error) 
            {
                if (i < retries - 1) {
                    const waitTime = 2 ** i * delayTime; // Exponential backoff
                    console.log(`Retrying in ${waitTime}ms...`);
                    await new Promise(res => setTimeout(res, waitTime));
                } else {
                    throw error;
                }
            }
        }
    };

    try {
       

        for (let campaign of activeCampaigns) {
            try {
                // Add delay to avoid hitting rate limits
                await new Promise(res => setTimeout(res, 1000)); 

                // Fetch ads for each campaign
                let adsUrl = `https://graph.facebook.com/v20.0/${campaign.id}/ads?fields=id,name&access_token=${accessToken}`;
                let adsResponse = await fetchWithRetry(adsUrl);
                let adsData = await adsResponse.json();

                console.log(`Fetched ${adsData.data.length} ads for campaign ${campaign.name}`);

                for (let ad of adsData.data) {
                    try {
                        // Fetch leads for each ad
                        let leadsUrl = `https://graph.facebook.com/v20.0/${ad.id}/leads?fields=id,field_data,created_time&access_token=${accessToken}&limit=100`;
                        let leadsResponse = await fetchWithRetry(leadsUrl);

                        let leadsData = await leadsResponse.json();
                        console.log(`Fetched ${leadsData.data.length} leads for campaign id ${campaign.id} campaign name${campaign.name} ad ${ad.name}`);

                        for (let lead of leadsData.data) {
                            const leadCreatedTime = new Date(lead.created_time);
                            if (leadCreatedTime > oneDayAgo) {
                                allData.push({
                                    data_id: lead.id,
                                    field_data: lead.field_data,
                                    created_time: lead.created_time,
                                    ad_id: ad.id,
                                    ad_name: ad.name,
                                    campaign_id: campaign.id,
                                    campaign_name: campaign.name,
                                    counsellorNo: "",
                                    counsellorName: ""
                                });
                            }
                        }
                    } catch (error) {
                        console.error(`Failed to fetch leads for ad ${ad.id}: ${error.message}`);
                    }
                }
            } catch (error) {
                console.error(`Failed to fetch ads for campaign ${campaign.id}: ${error.message}`);
            }
        }

        let totalLead = await counselorLead.find({created_time:{
                $gte:filterDate,
                $lte:nextDayFilterDate,
            }}
        )

        let originalLength = allData.length

        const newArray = allData.filter(item => {
            // Find the corresponding lead in totalLead by matching 'data_id' with 'id'
            const matchingLead = totalLead.find(lead => lead.id === item.data_id);
            if(matchingLead){
                console.log("matchingLead = ",matchingLead.counsellorNo)
            }
            
        
            // Condition 1: If there's no matching lead, return true to include this item in the new array
            if (!matchingLead) {
                console.log("if for not match")
                return true;
            }
        
            // Condition 2: If there's a matching lead, check if 'status' is an empty string
            if (matchingLead.counsellorNo === "") {
                return true; // Include this item in the new array
            }
        
            // If 'status' is not empty, don't include the item in the new array
            return false;
        });

        allData = newArray
        console.log("new array length =",newArray.length)

        res.send({ originalLength: originalLength, length: allData.length, totalLead: totalLead.length, data: allData,  });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send({ error: 'Failed to fetch data.' });
    }
});


// get latest facebook data by date range

router.get('/getFacebookAdDataByDateRange', async (req, res) => {
    const accessToken = 'EAALgVEQc5iQBO1ZCSJPlFaZCXtMnE2CZBhtGMSZBsfhjpB9p0tQXtPQthB6xg8TXl9b3WnejWo4NN8Y0m6W9pNsjqkGGaS9wWDKHXsomZCGu7zaOqK8SBQVIPlrOsIS3UiuSnPscZBEZAhCn0NhTHoZCs6223CPx1quZBX8PnWa6mzyZBBOPQt83ZBTpE4s';
    let allData = [];
    let nextPageUrl = `https://graph.facebook.com/v20.0/act_351689515/campaigns?fields=id,name,status&access_token=${accessToken}`;

    const fetchWithRetry = async (url, retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                let response = await fetch(url);
                if (response.ok) {
                    return response;
                }
                const errorText = await response.text();
                console.error(`Fetch error: ${errorText}`);
                throw new Error(`Fetch error: ${response.statusText}`);
            } catch (error) {
                if (i < retries - 1) {
                    await new Promise(res => setTimeout(res, 2 ** i * 1000));
                } else {
                    throw error;
                }
            }
        }
    };

    try {
        const { startDate, endDate } = req.query;
        
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);

        console.log("start and end date =",startDateTime,endDateTime,startDate,endDate)

        if (isNaN(startDateTime) || isNaN(endDateTime)) {
            return res.status(400).send({ error: 'Invalid date range provided.' });
        }

        let activeCampaigns  = await fetchWithRetry(nextPageUrl);
        activeCampaigns = await activeCampaigns.json();
        activeCampaigns = activeCampaigns.data;

        if (activeCampaigns) {
            let count = 0;
            for (let campaign of activeCampaigns) 
                {
                count += 1;
                console.log("count of API is=",count)
                try {
                    let adsUrl = `https://graph.facebook.com/v20.0/${campaign.id}/ads?fields=id,name&access_token=${accessToken}`;
                    let adsResponse = await fetchWithRetry(adsUrl);
                    let adsData = await adsResponse.json();

                    if (adsData && adsData.data) {
                        for (let ad of adsData.data) {
                            try {
                                let leadsUrl = `https://graph.facebook.com/v20.0/${ad.id}/leads?fields=id,field_data,created_time&access_token=${accessToken}&limit=10`;
                                let leadsResponse = await fetchWithRetry(leadsUrl);
                                let leadsData = await leadsResponse.json();

                                if (leadsData && leadsData.data) {
                                    for (let lead of leadsData.data) {
                                        const leadCreatedTime = new Date(lead.created_time);
                            
                                            allData.push({
                                                data_id: lead.id,
                                                field_data: lead.field_data,
                                                created_time: lead.created_time,
                                                ad_id: ad.id,
                                                ad_name: ad.name,
                                                campaign_id: campaign.id,
                                                campaign_name: campaign.name
                                            });
                                        
                                    }
                                }
                            } catch (error) {
                                console.error(`Failed to fetch leads for ad ${ad.id}: ${error.message}`);
                            }
                        }
                    }
                } 
                catch (error) {
                    console.error(`Failed to fetch ads for campaign ${campaign.id}: ${error.message}`);
                }
            }
        }

        res.send({ length: allData.length, data: allData });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send({ error: 'Failed to fetch data.' });
    }
});



// get latest facebook data mine function

router.get('/getMineLatestFacebookAdData', async (req, res) => 
    {
    const accessToken = 'EAALgVEQc5iQBO1ZCSJPlFaZCXtMnE2CZBhtGMSZBsfhjpB9p0tQXtPQthB6xg8TXl9b3WnejWo4NN8Y0m6W9pNsjqkGGaS9wWDKHXsomZCGu7zaOqK8SBQVIPlrOsIS3UiuSnPscZBEZAhCn0NhTHoZCs6223CPx1quZBX8PnWa6mzyZBBOPQt83ZBTpE4s';
    let allData = [];
    let nextPageUrl = `https://graph.facebook.com/v20.0/act_351689515/campaigns?fields=id,name,status&access_token=${accessToken}`;

    // const fetchWithRetry = async (url, retries = 3) => {
    //     for (let i = 0; i < retries; i++) {
    //         try {
    //             let response = await fetch(url);
    //             if (response.ok) {
    //                 return response;
    //             }
    //             const errorText = await response.text();
    //             console.error(`Fetch error: ${errorText}`);
    //             throw new Error(`Fetch error: ${response.statusText}`);
    //         } catch (error) {
    //             if (i < retries - 1) {
    //                 await new Promise(res => setTimeout(res, 2 ** i * 1000));
    //             } else {
    //                 throw error;
    //             }
    //         }
    //     }
    // };

    // const now = new Date();
    // const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    try {
        while (nextPageUrl) {
            let response = await fetchWithRetry(nextPageUrl);
            let data = await response.json();

            if (data && data.data) {
                const activeCampaigns = data.data.filter(campaign => campaign.status === 'ACTIVE');

                for (let campaign of activeCampaigns) {
                    try {
                        let adsUrl = `https://graph.facebook.com/v20.0/${campaign.id}/ads?fields=id,name&access_token=${accessToken}`;
                        let adsResponse = await fetchWithRetry(adsUrl);
                        let adsData = await adsResponse.json();

                        if (adsData && adsData.data) {
                            for (let ad of adsData.data) {
                                try {
                                    let leadsUrl = `https://graph.facebook.com/v20.0/${ad.id}/leads?fields=id,field_data,created_time&access_token=${accessToken}&limit=5`;
                                    let leadsResponse = await fetchWithRetry(leadsUrl);
                                    let leadsData = await leadsResponse.json();

                                    if (leadsData && leadsData.data) 
                                        {
                                        for (let lead of leadsData.data) {
                                            const leadCreatedTime = new Date(lead.created_time);
                                            if (leadCreatedTime > oneDayAgo) {
                                                allData.push({
                                                    data_id: lead.id,
                                                    field_data: lead.field_data,
                                                    created_time: lead.created_time,
                                                    ad_id: ad.id,
                                                    ad_name: ad.name,
                                                    campaign_id: campaign.id,
                                                    campaign_name: campaign.name
                                                });
                                            }
                                        }
                                    }
                                } catch (error) {
                                    console.error(`Failed to fetch leads for ad ${ad.id}: ${error.message}`);
                                }
                            }
                        }
                    } catch (error) {
                        console.error(`Failed to fetch ads for campaign ${campaign.id}: ${error.message}`);
                    }
                }
            }

            nextPageUrl = data.paging ? data.paging.next : null;
        }

        res.send({ length: allData.length, data: allData });
    } 
    catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send({ error: 'Failed to fetch data.' });
    }
});

// get latest facebook data with excel

router.get('/getLatestFacebookAdExcelData', async (req, res) => {
    const accessToken = 'EAALgVEQc5iQBO1ZCSJPlFaZCXtMnE2CZBhtGMSZBsfhjpB9p0tQXtPQthB6xg8TXl9b3WnejWo4NN8Y0m6W9pNsjqkGGaS9wWDKHXsomZCGu7zaOqK8SBQVIPlrOsIS3UiuSnPscZBEZAhCn0NhTHoZCs6223CPx1quZBX8PnWa6mzyZBBOPQt83ZBTpE4s';
    let allData = [];
    let nextPageUrl = `https://graph.facebook.com/v20.0/act_351689515/campaigns?fields=id,name,status&access_token=${accessToken}`;

    const fetchWithRetry = async (url, retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                let response = await fetch(url);
                if (response.ok) {
                    return response;
                }
                const errorText = await response.text();
                console.error(`Fetch error: ${errorText}`);
                throw new Error(`Fetch error: ${response.statusText}`);
            } catch (error) {
                if (i < retries - 1) {
                    await new Promise(res => setTimeout(res, 2 ** i * 1000)); // Exponential backoff
                } else {
                    throw error;
                }
            }
        }
    };

    try {
        while (nextPageUrl) {
            let response = await fetchWithRetry(nextPageUrl);
            let data = await response.json();

            if (data && data.data) {
                const activeCampaigns = data.data.filter(campaign => campaign.status === 'ACTIVE');

                for (let campaign of activeCampaigns) {
                    try {
                        let adsUrl = `https://graph.facebook.com/v20.0/${campaign.id}/ads?fields=id,name&access_token=${accessToken}`;
                        let adsResponse = await fetchWithRetry(adsUrl);
                        let adsData = await adsResponse.json();

                        if (adsData && adsData.data) {
                            for (let ad of adsData.data) {
                                try {
                                    let leadsUrl = `https://graph.facebook.com/v20.0/${ad.id}/leads?fields=id,field_data,created_time&access_token=${accessToken}&limit=100`;
                                    let leadsResponse = await fetchWithRetry(leadsUrl);
                                    let leadsData = await leadsResponse.json();

                                    if (leadsData && leadsData.data) {
                                        for (let lead of leadsData.data) {
                                            allData.push({
                                                data_id: lead.id,
                                                field_data: lead.field_data,
                                                created_time: lead.created_time,
                                                ad_id: ad.id,
                                                ad_name: ad.name,
                                                campaign_id: campaign.id,
                                                campaign_name: campaign.name
                                            });
                                        }
                                    }
                                } catch (error) {
                                    console.error(`Failed to fetch leads for ad ${ad.id}: ${error.message}`);
                                }
                            }
                        }
                    } catch (error) {
                        console.error(`Failed to fetch ads for campaign ${campaign.id}: ${error.message}`);
                    }
                }
            }

            nextPageUrl = data.paging ? data.paging.next : null;
        }

        const worksheet = XLSX.utils.json_to_sheet(allData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads Data');
        
        const filePath = path.join(__dirname, 'facebook_leads_data.xlsx');
        XLSX.writeFile(workbook, filePath);

        res.setHeader('Content-Disposition', 'attachment; filename=facebook_leads_data.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.sendFile(filePath);

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send({ error: 'Failed to fetch data.' });
    }
});



// get all ads

router.get('/getFacebookAdsData', async (req, res) => {
    const accessToken = 'EAALgVEQc5iQBO1ZCSJPlFaZCXtMnE2CZBhtGMSZBsfhjpB9p0tQXtPQthB6xg8TXl9b3WnejWo4NN8Y0m6W9pNsjqkGGaS9wWDKHXsomZCGu7zaOqK8SBQVIPlrOsIS3UiuSnPscZBEZAhCn0NhTHoZCs6223CPx1quZBX8PnWa6mzyZBBOPQt83ZBTpE4s';
    const apiUrl = `https://graph.facebook.com/v14.0/act_351689515/ads?fields=id,name,creative,status,created_time&access_token=${accessToken}`;

    try {
        let response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        let data = await response.json();

       

        data = data.data.filter(data=>{
            return(data.status=="ACTIVE")
        })

        console.log("data after map =",data.data)

        let allCounselor = await counselors.find({})


        let obj={}

        allCounselor.map(data=>{
            obj[data.counselorNo] = data.assignedAd
        })

        let dbAd = await adData.find({})

        console.log("db ad  =",dbAd.length, data.length)

        if(dbAd.length==data.length){
            res.send({ data: dbAd, length: dbAd.length, dbADLength:dbAd.length,obj:obj });
        }

        else if(dbAd.length==0){
            res.send({ data: data, length: data.length, dbADLength:dbAd.length,obj:obj });
        }

        else if(data.length > dbAd.length) {
            data.forEach(item => {
                // Check if the item is already in dbAd
                const exists = dbAd.some(dbItem => dbItem.id == item.id);
                
                // If the item is not in dbAd, add it
                if (!exists) {
                    dbAd.push({
                        ...item, // Spread the properties of the item
                        assigned_counsellor: "", // Add additional fields
                        assigned_counsellor_name: ""
                    });
                }
            });

            res.send({ data: dbAd, length: dbAd.length, dbADLength:dbAd.length,obj:obj });
        }

        else if(data.length < dbAd.length) {
            console.log("db ad length is less")
            // Remove items from dbAd that do not exist in data
            dbAd = dbAd.filter(dbItem => {
                return data.some(item => item.id === dbItem.id);
            });
        
            // Add missing items from data to dbAd with additional fields
            data.forEach(item => {
                const exists = dbAd.some(dbItem => dbItem.id === item.id);
                if (!exists) {
                    console.log("exist not in dbAd =")
                    dbAd.push({
                        ...item,
                        assigned_counsellor: "",
                        assigned_counsellor_name: ""
                    });
                }
            });
        
            res.send({ data: dbAd, length: dbAd.length,obj:obj  });
        }

      

        
    } catch (error) {
        console.error('Error fetching ads data:', error);
        res.status(500).send({ error: 'Failed to fetch ads data.' });
    }
});



router.get('/readSheetData', async (req, res) => {
    console.log("Request received with date:", req.body.date);

    let counselorNo  = req.header('counselorNo');
    let date  = req.header('startDate');

    try {
        const serviceAccountAuth = new JWT({
            email: 'googlereaddata@sheetread-430310.iam.gserviceaccount.com',
            key: '-----BEGIN PRIVATE KEY-----\nMIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQDgHy3f8qZOjup3\nea+UPeyL3SAOWJhQpC8BuddJpxfRdkMSTeL1PHy+U2hcRtgYP0EG9KgWS47pvE8m\ntsmXWK1Mf/brLx0I0ucYxywmDfO2Jxj+okVkQnqvAKRO+pcbl0XUdO0X2s7IBDQo\nNZcDKm8vGojV8w2erFOffehNuTZ/kxCahDmwVT2m6elcYVp+Rvz9+28/sfEP1CaW\n2bjH1cD1+Pni3Cl3R8DF3Gz0SHu4c6x+HyLnCF0M48NXvE5UwY07IgAZZajlw5M5\nxHzC1ZqEXA/miQuE/6feQQfys05IMgo2ymaIyFp5B30WqgjpFDnv4TDc4PysTJXV\nevGNWWINAgMBAAECggEAD180F0seSv8UZ9NpzoIcyk8FVtaOw+Eu9DBZ6sxSHuS8\nnvHGokleyPMRklqtkaQtApwfN0BBchifWSlqVD4ZzMhuGB1oIWXNwe5PQeDtGU4/\nMZ/RoJnKrlwd6OjZGmRavsKyTFOOoTtglG1wiSAM9i8cuYftJDfvmF3bZBFTApbj\nze9kGh0F5cGLHUXypLWbkVRgF1arUBMqbPIj3qlWc2u0TLkG+KDFmd9CJVOyKrNt\nodtMSOKqt3opna6U3eY7p+MIJW96OBVgx08IVfE7dZEcvuQvYkL1u+BAAp4yhvJO\nz5toG0h4jmC9aCPmuJnAuAIW+E+n83rKbDpRnAQq4QKBgQDwWxuHAh2R5q6Mjz3u\n3tccFQJxuDR2v8Wmt5RQKb4yJZjpqlYipsOCAG4jNpGlWpWBwcPZ3egcTViVUgJN\nbU2VqUrz++kHal3DnFEJVYWbXy9NqnO2wgBJwIrOJhRxL1PIUJasetTFHQj21+92\n9XmgJ9qAmu6DbZaNimfDkThYCQKBgQDutZLXKHyVGLXfvqtBjf7QDkePdP6NHxuD\nVwJi7wJdgdRRk9swArTBYgAVp0i4gEo+QQ8h15SSaM/5Aj3CdQfIhTblXHC/WZdP\nbv0f4S2EieQDVLDLe0Zxt4phC/8axKU0hTM7AwpuL1OuHk4ysu+rR375BQeWgroG\nTINxDjIS5QJ/SxwtfgMrOmzcHxCkSgFZN21ZVjA6NOG44mB7+JES3pjhMCQKxslW\nT0nTIS3sVb/4+JOUoIC4CCAjjoYSMh/2Hs7InXYbXDXhFz/CEyiml+cm4R5jCrmV\nXXbN6Z38xWIEzJRigYPg+bgZFQplysbrOyE5JvdDkc6tPY4C3xqCgQKBgCyNp0KR\nQ+9wFUIVjFFH929Nuv2DkJ82VyREcSWWBpL9UGuJdTeYybPuXqWr+160UycbbX+b\nhRduiKKpUG2i+jjq5Dwa7NBKIHuq84Onu58pPW2BuR3BfHxtDV7fplWQrmUHF3DE\nOIYoPy4Yae/8hc8qIQDJd4kYDTBvx3iqdZ4hAoGAWPpHGkgGwueeHA7MxbXnbGZf\n4RytzVyVfcg+BjcOIL2MaTinAh82ry7wRghs/jEpSlTSpaVaOpbiMmQ5q0osdWEp\nmKJ4d+cHVpzHTyjgRjcbeJKKtvVCozqGjJlCpPZeLA7YrqeH8fQ0sB5wSN6p28WZ\nF5BOjFN/MPUrfBsV0M0=\n-----END PRIVATE KEY-----\n',
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet('1wufgbfxf-Fp02tKTRXH4s127zCUpp1KI83R1G_AkVFg', serviceAccountAuth);

        await doc.loadInfo(); // Load document properties and worksheets
        const sheet = doc.sheetsByIndex[0]; // Adjust the index as needed

        console.log('Document title:', doc.title);

        // Fetch the header row to determine the date column index
        await sheet.loadHeaderRow();
        const headers = sheet.headerValues;
        const dateColumnIndex = headers.indexOf('date'); // Replace 'Date' with your actual date column header

        if (dateColumnIndex === -1) {
            res.json({ status: false, message: "Date column not found." });
            return;
        }

        // Fetch all rows (due to API limitations)
        const rows = await sheet.getRows();

        const data = rows.map((row) => {
            let rowData = {};
            headers.forEach((header, index) => {
                rowData[header] = row._rawData[index];
            });
            return rowData;
        });

        // Filter rows based on the specific date
        const specificDate = req.body.date; // Expecting the date in 'YYYY-MM-DD' format

        const filteredRows = data.filter((row) => {
            try {
                // Extract the date part in 'YYYY-MM-DD' format
                const rowDate = new Date(row.date).toISOString().split('T')[0];
                return (rowDate == date && row.counsellorno==counselorNo);
            } catch (err) {
                console.error('Invalid date format:', row.date);
                return false;
            }
        });

        // console.log("Filtered data =", filteredRows);

        // Check if any rows matched the date
        if (!filteredRows.length) {
            res.json({ status: false, message: "No data found for the specified date." });
            return;
        }

        // Convert filtered rows to JSON
        res.json({ status: true, filteredRows });

    } catch (error) {
        console.log('Error:', error.message);
        res.json({ status: false, message: error.message });
    }
});




// route to add/update adData

router.post('/adData', fetchuser, async(req,res)=>{

    let data = req.body.allAd

    let counsellorAd = req.body.counsellorAd
    console.log('data from counselor lead =',data.length)


   try {
    // Fetch all existing ids from adData collection
    const existingAds = await adData.find({}, { id: 1, _id: 0 });
    const existingIds = existingAds.map(ad => ad.id);

    // Get all ids from the incoming data
    const incomingIds = data.map(element => element.id);

    // Find ids that are in adData collection but not in incoming data
    const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
    console.log("ids delete =",idsToDelete)

    // Delete the ads that are not present in incoming data
    await adData.deleteMany({ id: { $in: idsToDelete } });

    // Process each element in incoming data
    for (const element of data) {
        try 
        {
            let adUpdateData = await adData.updateOne({ id: element.id },
                { $set: element }, { upsert: true });

            let counsellor = await counselors.updateOne({ counselorNo: element.assigned_counsellor },
                { $set: { assignedAd: counsellorAd[element.assigned_counsellor] } });

            // Other operations with the counsellor (if needed)

        } 
        catch (error) 
        {
            console.log("Error updating element:", element, "Error message =", error.message);
        }
    }

    console.log("Ad data updated successfully.");
} catch (error) {
    console.log("Error in updateAdData function:", error.message);
}

 res.send({status:true})
})

// route to assign Campaign to counsellor

router.post('/assignCampaign', fetchuser, async(req,res)=>{

    let data = req.body.allAd

    let counsellorAd = req.body.counsellorAd
    console.log('data from counselor lead =',data.length)


   try {
    // Fetch all existing ids from adData collection
    const existingAds = await adData.find({}, { id: 1, _id: 0 });
    const existingIds = existingAds.map(ad => ad.id);

    // Get all ids from the incoming data
    const incomingIds = data.map(element => element.id);

    // Find ids that are in adData collection but not in incoming data
    const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
    console.log("ids delete =",idsToDelete)

    // Delete the ads that are not present in incoming data
    await adData.deleteMany({ id: { $in: idsToDelete } });

    // Process each element in incoming data
    for (const element of data) {
        try 
        {
            let adUpdateData = await adData.updateOne({ id: element.id },
                { $set: element }, { upsert: true });

            let counsellor = await counselors.updateOne({ counselorNo: element.assigned_counsellor },
                { $set: { assignedAd: counsellorAd[element.assigned_counsellor] } });

            // Other operations with the counsellor (if needed)

        } 
        catch (error) 
        {
            console.log("Error updating element:", element, "Error message =", error.message);
        }
    }

    console.log("Ad data updated successfully.");
} catch (error) {
    console.log("Error in updateAdData function:", error.message);
}

 res.send({status:true})
})


// route to add CounselorLead 

router.post('/counselorLead',bodyParser.json({ limit: '10kb' }), async(req,res)=>
    {

    let data = req.body

    console.log("data length =",data.length)
    for (let element of data)
        {

    try
    {
    let counselorLeadData = await counselorLead.updateOne({created_time:element.created_time, id:element.id},
        {$set: element}, {upsert: true})

        // console.log("counselor lead data added",counselorLeadData)
    }
    catch(error)
    {
        res.send({status:true})
        console.log("error message =",error.message)
    }

    }

    res.send({status:true})
    
})

// route to add latestTemporary data

router.post('/addtemporaryLatest',bodyParser.json({ limit: '10kb' }), async(req,res)=>
    {
        
        let data = req.body
        console.log("add temp latest data route",data)

    console.log("data length =",data.length)
    for (let element of data)
        {

    try
    {

        // let deleteLatestData  =await latestData.deleteMany({})
    let tempLatestData = await latestData.updateOne({created_time:element.created_time, id:element.id},
        {$set: element}, {upsert: true})
 

        // console.log("counselor lead data added",tempLatestData)
    
    }
    catch(error)
    {
        res.send({status:true})
        console.log("error message =",error.message)
    }

    }

    res.send({status:true})
    
})


// route to delete selected data from latestlead

router.post('/deleteAssignedtemporaryLatest',bodyParser.json({ limit: '10kb' }), async(req,res)=>
    {
        
const data = req.body

console.log("data of assigned delete data =",data)

for(const element of data){
    
    try
    {

        let deleteLatestData = await latestData.deleteMany({id:element.id})
    
    }
    catch(error)
    {
        res.send({status:true})
        console.log("error message =",error.message)
    }
}
   

    res.send({status:true})
    
})

// route to get temporary latest data


// route to delete latestData

router.post('/deletetemporaryLatest',bodyParser.json({ limit: '10kb' }), async(req,res)=>
    {
        

    try
    {

        let deleteLatestData = await latestData.deleteMany({})
    
    }
    catch(error)
    {
        res.send({status:true})
        console.log("error message =",error.message)
    }

   

    res.send({status:true})
    
})

router.get('/getTemporaryLatest', async(req,res)=>
    {

        console.log("get temp data =")
    try
    {

        let tempLatestData  = await latestData.find({})

        console.log("temp latest data ",tempLatestData)
        res.send({"status":true, "tempLatestData":tempLatestData})
    }
    catch(error)
    {
        res.send({status:true})
        console.log("error message =",error.message)
    }
    
})


// route to add expiry time 

router.post('/addExpiry', async(req,res)=>
    {

    let expiry = req.header("expiry")

    console.log("data length =",expiry)

    try
    {
    let expiryDelete = await Expiry.deleteMany({});

    let expiryAdd  = await Expiry.create({expiry:expiry})

    res.send({"status":true})
       
    }
    catch(error)
    {
        res.send({status:true})
        console.log("error message =",error.message)
    }

    
})

// route to get expiry 

router.get('/getExpiry', async(req,res)=>
    {

    try
    {
    let expiry = await Expiry.find({});


    res.json({"status":true, "expiry":expiry})
       
    }
    catch(error)
    {
        res.send({status:true})
        console.log("error message =",error.message)
    }
    
})


// route to add counselor demo

// router.post('/counselorDemo', fetchuser, async(req,res)=>
//     {

        
//         let data = req.body
//     console.log("counselor demo route is calling",data)
//     let counsellor = await counselors.findOne({_id:req.user.id})
//     data.counselorNo = counsellor.counselorNo

    

//     // console.log('data from counselor lead =',req.user)
// if(data.length>0)
//     {
//    try{
        
//     console.log("demo student =",data)
//     for(const element of data){
//     let counselorLeadData = await counselorsdemo.updateOne({date: element.date, id:data.id, counselorNo:element.counselorNo},
//         {$set: element}, {upsert: true})
    
//         console.log("counselor lead data added",counselorLeadData)
//     }
//     console.log("last before res send")
//     res.send({status:true})
// }
//     catch(error){
//         res.send({status:false})
//         console.log("error message =",error.message)
//     }
// }
// else{
// res.send({status:true})
// }
    
// })

router.post('/counselorDemo', fetchuser, async(req,res)=>{

    let demoData = req.body
    let counsellor = await counselors.findOne({_id:req.user.id})
    let status = req.header("status")
    console.log("demo status =",status)
  
   try{

   for (const data of demoData) {
       data.counselorNo = counsellor.counselorNo;
       // console.log("data of updated visit route =", VisitData);
       
       // Update or insert the data
       await counselorsdemo.updateOne(
         {
           date: data.date,
           counselorNo: data.counselorNo,
           id:data.id
         },
         { $set: data },
         { upsert: true }
       );


       if(status!="allLead")
{
       await counselorLead.updateOne({
        id:data.id
       },{$set:{status:data.status,finalStatus:data.finalStatus,finalDate:data.finalDate,finalStatusFrom:data.finalStatusFrom,scheduleDate:data.reschedule}},
    {upsert:true});
   }

   else{
    await counselorLead.updateOne({
        id:data.id
       },{$set:{finalStatus:data.finalStatus,finalDate:data.finalDate,finalStatusFrom:data.finalStatusFrom,scheduleDate:data.reschedule}},
    {upsert:true});
   }
     }
     
     // Extract identifiers from VisitData for comparison
    //  const demoDataIdentifiers = demoData.map(data => ({
    //    date: data.date,
    //    counselorNo: data.counselorNo,
    //    id:data.id
    //  }));
     
     // Remove additional records not present in VisitData
    //  await counselorsdemo.deleteMany({
    //     date:deletedDate,
    //    counselorNo: counsellor.counselorNo,
    //    $nor: demoDataIdentifiers
    //  });

     

   res.send({status:true})
   }
   catch(error)
   {
       res.send({status:false})
       console.log("error message =",error.message)
   }
   
})


// route to add demo reschedule 

router.post('/counselorDemoReschedule', fetchuser, async(req,res)=>{

    let data = req.body
    let counsellor = await counselors.findOne({_id:req.user.id})
    
    let reSchedule = req.body

    let olddemoData = await demoReschedule.find({scheduleDate:data.scheduleDate, counselorNo:data.counselorNo})
    let allId = data.map(element=>{
        return element.id
    })
    
    // console.log('data from counselor reSchedule route =',req.user, req.body)

    try{
        for (const data of reSchedule) 
        {
            data.counselorNo = counsellor.counselorNo
            console.log("data from demo reschedule route =",data)

        try {
            let reScheduleOld = await demoReschedule.updateOne({ id: data.id, counselorNo: counsellor.counselorNo },{ $set: data  },  { upsert: true });         

            // Uncomment if you want to send a success response after each iteration
            // res.send({ status: true });
            // console.log("counselor reschedule data added", counselorRescheduleData);
        } catch (error) {
            res.send({ status: false });
            console.log("error message =", error.message);
        }
    }

    res.send({ status: true });
}

    catch(error)
    {
        res.send({ status: false });
            console.log("error message =", error.message);
    }

    
    
})

// route to update demoSchedule and counselor demo

router.post('/counselorUpdateDemoReschedule', fetchuser, async(req,res)=>{

    let data = req.body
    let counsellor = await counselors.findOne({_id:req.user.id})
    data.counselorNo = counsellor.counselorNo
    let reScheduleStudent = req.body

    // console.log("demo schedule updated=",reScheduleStudent)

    // console.log('data from counselor reSchedule route =',req.user, req.body)

    try{
        for (const data of reScheduleStudent) {

        try {

            let CounselorDemo = await counselorsdemo.findOne({ date: data.scheduleDate, counselorNo: counsellor.counselorNo });
            let reScheduleDemo = await demoReschedule.findOne({ 
                name: data.name, mobile:data.mobile, counselorNo: counsellor.counselorNo });

             if(reScheduleDemo.status!=data.status){

                let result = await demoReschedule.deleteOne({ 
                    id:data.id,
                    counselorNo: counsellor.counselorNo 
                });

             }

             else{
                let UpdatedDemoSchedule = await demoReschedule.updateOne(
                    { 
                        id:data.id,
                       counselorNo: counsellor.counselorNo
                     },
                    { $set: data },{ upsert: true }
                );
             }
               

                console.log("Reschedule demo =",reScheduleDemo)

         let newDemoStudent  =  CounselorDemo.demoStudent.map((element,index)=>{
                    if(element.id==data.id)
                        {

                        let tempDemoStudent = CounselorDemo.demoStudent[index] 
                        tempDemoStudent.status = data.status 
                        tempDemoStudent.reschedule = data.reschedule

                        return tempDemoStudent
                    }

                    else{
                        return element
                    }
            })



            let updateCounselorDemo = await counselorsdemo.updateOne(
                { date: data.scheduleDate, counselorNo: counsellor.counselorNo },
                { $set: { demoStudent: newDemoStudent } }
            );

           

        } catch (error) {
            res.send({ status: false });
            console.log("error message =", error.message);
        }
    }
    res.send({ status: true });
}

    catch{
        res.send({ status: false });
        console.log("error message =", error.message);
    }

    
    
})


// route to add counselor visit

router.post('/counselorVisit', fetchuser, async(req,res)=>{

     let VisitData = req.body
     let counsellor = await counselors.findOne({_id:req.user.id})
     let status = req.header("status")
   

    // console.log('data from counselor lead =',req.user)

    try{
    //     for(const data of VisitData){
    //         data.counselorNo = counsellor.counselorNo
    //         console.log("data of updated visit route =",VisitData )
    //         let counselorLeadData = await counselorsvisit.updateOne({date: data.date, counselorNo:data.counselorNo, name:data.name, mobile:data.mobile},
    //     {$set: data}, {upsert: true})
    //     // res.send({status:true})
    //     // console.log("counselor lead data added",counselorLeadData)
    // }

    for (const data of VisitData) {
        data.counselorNo = counsellor.counselorNo;
        // console.log("data of updated visit route =", VisitData);
        
        // Update or insert the data
        await counselorsvisit.updateOne(
          {
            date: data.date,
            counselorNo: data.counselorNo,
            id:data.id
          },
          { $set: data },
          { upsert: true }
        );

        if(status!="allLead")
        {
        await counselorLead.updateOne({
            id:data.id
           },{$set:{status:data.visitStatus,finalStatus:data.finalStatus,finalDate:data.finalDate,finalStatusFrom:data.finalStatusFrom,scheduleDate:data.visitDate}},
        {upsert:true});
        }
        else{
            await counselorLead.updateOne({
                id:data.id
               },{$set:{finalStatus:data.finalStatus,finalDate:data.finalDate,finalStatusFrom:data.finalStatusFrom,scheduleDate:data.visitDate}},
            {upsert:true});
        }
      }


      
      
      // Extract identifiers from VisitData for comparison
    //   const visitDataIdentifiers = VisitData.map(data => ({
    //     date: data.date,
    //     counselorNo: data.counselorNo,
    //     id:data.id
    //   }));
      
      // Remove additional records not present in VisitData
    //   await counselorsvisit.deleteMany({
    //     counselorNo: counsellor.counselorNo,
    //     $nor: visitDataIdentifiers
    //   });

    res.send({status:true})
    }
    catch(error){
        res.send({status:false})
        console.log("error message =",error.message)
    }
    
})

// route to add counselor followUp

router.post('/counselorFollowUp', fetchuser, async(req,res)=>{

    let FollowUpData = req.body
     let counsellor = await counselors.findOne({_id:req.user.id})
     let status = req.header("status")

    // console.log('data from counselor lead =',counsellor.counselorNo)
try{
//     for(const data of FollowUpData){
//         data.counselorNo = counsellor.counselorNo;
//     try
//     {
//         console.log("data of counsellor follow up=",data)
//         let counselorLeadData = await counselorsfollowUp.updateOne({date: data.date, counselorNo:counsellor.counselorNo, name:data.name, mobile:data.mobile},
//         {$set: data}, {upsert: true})

//         console.log("counselor lead data added",counselorLeadData)
//     }
//     catch(error){

//         res.send({status:false})
//         console.log("error message =",error.message)
//     }
// }

for (const data of FollowUpData) {
    data.counselorNo = counsellor.counselorNo;
    // console.log("data of updated visit route =", FollowUpData);
    
    // Update or insert the data
    await counselorsfollowUp.updateOne(
      {
        date: data.date,
        counselorNo: data.counselorNo,
        id:data.id
      },
      { $set: data },
      { upsert: true }
    );



    if(status!="allLead")
        {
        await counselorLead.updateOne({
            id:data.id
           },{$set:{status:data.status,finalStatus:data.finalStatus,finalDate:data.finalDate,finalStatusFrom:data.finalStatusFrom,scheduleDate:data.lastFollowUpDate}},
        {upsert:true});
        }
        else{
            await counselorLead.updateOne({
                id:data.id
               },{$set:{finalStatus:data.finalStatus,finalDate:data.finalDate,finalStatusFrom:data.finalStatusFrom,scheduleDate:data.lastFollowUpDate}},
            {upsert:true});
        }
  }


  
  
  // Extract identifiers from VisitData for comparison
//     const followUpDataIdentifiers = FollowUpData.map(data => ({
//     date: data.date,
//     counselorNo: data.counselorNo,
//     id:data.id
//   }));
  
  // Remove additional records not present in VisitData
//   await counselorsfollowUp.deleteMany({
//     counselorNo: counsellor.counselorNo,
//     $nor: followUpDataIdentifiers
//   });
res.send({status:true})
}

catch(error){
    res.send({status:false})
        console.log("error message =",error.message)
}
    
})

// route to get counsellor lead count

router.get('/getcounselorLeadCount',async(req,res)=>{

    let counselorNo  = req.header('counselorNo');
    let startDate  = req.header('startDate');
    let endDate  = req.header('endDate');

    console.log(" counselor no start and end date = ",counselorNo, startDate, endDate)

    try{
    let totalLead = await counselorLead.find({counsellorNo:counselorNo,
        assignedDate:{
            $gte:startDate,
            $lte:endDate,
        },
}
    )
    let totalDemo = await counselorDemo.find({counselorNo:counselorNo,
        date:{
            $gte:startDate,
            $lte:endDate,
        }}
    )
    let totalFollowUp = await counselorsfollowUp.find({counselorNo:counselorNo,
        date:{
            $gte:startDate,
            $lte:endDate,
        }}
    )
    let totalVisit = await counselorsvisit.find({counselorNo:counselorNo,
        date:{
            $gte:startDate,
            $lte:endDate,
        }}
    )

    res.send({"leadLength":totalLead.length, "totalLead":totalLead,  "totalDemo":totalDemo, "totalFollowUp":totalFollowUp, "totalVisit":totalVisit, "status":true})
    }
    catch(error){
        console.log("error from total lead route=",error.message)
        res.send({"error":error.message, "status":false})
    }
    
})

// route to get data acc to date campaign and counsellor

router.get('/getcounselorLeadFilter',async(req,res)=>{

    let counselorNo  = req.header('counselorNo');
    let campaignId  = req.header('campaignId');
    let startDate  = req.header('startDate');
    let endDate  = req.header('endDate');

    console.log(" counselor no start and end date = ",counselorNo, campaignId, typeof(campaignId), startDate, endDate)

    try{
    let totalLead = await counselorLead.find({
        assignedDate:{
            $gte:startDate,
            $lte:endDate,
        }
    }
    )

    let filterData = totalLead.filter(data=>{
        // console.log("data.created_time>=startDate =",data.counsellorNo==counselorNo)
        
        if(campaignId!="" && counselorNo!=""){
            return(data.campaignId==campaignId && data.counsellorNo==counselorNo)
        }
        else if(campaignId!=""){
            return(data.campaignId==campaignId)
        }

        else if(counselorNo!=""){
            return(data.counsellorNo==counselorNo)
        }
        else{
            return true
        }
    })

    let totalDemo = await counselorDemo.find({counselorNo:counselorNo,
        date:{
            $gte:startDate,
            $lte:endDate,
        }}
    )
    let totalFollowUp = await counselorsfollowUp.find({counselorNo:counselorNo,
        date:{
            $gte:startDate,
            $lte:endDate,
        }}
    )
    let totalVisit = await counselorsvisit.find({counselorNo:counselorNo,
        date:{
            $gte:startDate,
            $lte:endDate,
        }
    }
    )

    // console.log("total lead =",totalLead)

    res.send({"filterData":filterData,"leadLength":totalLead.length, "totalLead":filterData,  "totalDemo":totalDemo, "totalFollowUp":totalFollowUp, "totalVisit":totalVisit, "status":true})
    }
    catch(error){
        console.log("error from total lead route=",error.message)
        res.send({"error":error.message, "status":false})
    }
    
})

// route to get counsellor lead acc to date

router.get('/getLeadFilter',async(req,res)=>{

    let counselorNo  = req.header('counselorNo');
    let campaignId  = req.header('campaignId');
    let startDate  = req.header('startDate');
    let endDate  = req.header('endDate');

    console.log(" counselor no start and end date = ",counselorNo, campaignId, typeof(campaignId), startDate, endDate)

    try{
    let totalLead = await counselorLead.find({
        assignedDate:{
            $gte:startDate,
            $lte:endDate,
        }
    }
    )

    let AlltotalLead = await counselorLead.find()
    console.log("campaign id and counsellor no =",campaignId!="",counselorNo)

    let filterData = totalLead.filter(data=>{
        // console.log("data.created_time>=startDate =",data.counsellorNo==counselorNo)
        
        if(campaignId!="" && counselorNo!=""){
            return(data.campaignId==campaignId && data.counsellorNo==counselorNo)
        }
        else if(campaignId!=""){
            return(data.campaignId==campaignId)
        }

        else if(counselorNo!=""){
            return(data.counsellorNo==counselorNo)
        }
        else{
            return true
        }
    })


    let totalDemo = await counselorDemo.find({counselorNo:counselorNo,
        date:{
            $gte:startDate,
            $lte:endDate,
        }}
    )
    let totalFollowUp = await counselorsfollowUp.find({counselorNo:counselorNo,
        date:{
            $gte:startDate,
            $lte:endDate,
        }}
    )
    let totalVisit = await counselorsvisit.find({counselorNo:counselorNo,
        date:{
            $gte:startDate,
            $lte:endDate,
        }
    }
    )

    // console.log("total lead =",totalLead)

    res.send({"filterData":filterData,"leadLength":totalLead.length, "totalLead":filterData,  "totalDemo":totalDemo, "totalFollowUp":totalFollowUp, "totalVisit":totalVisit, "AlltotalLead":AlltotalLead, "status":true})
    }
    catch(error){
        console.log("error from total lead route=",error.message)
        res.send({"error":error.message, "status":false})
    }
    
})
router.get('/getCounsellorRingingConnectedRegistered',async(req,res)=>{

    let counselorNo  = req.header('counselorNo');
    let campaignId  = req.header('campaignId');
    let from  = req.header('from');
    let startDate  = req.header('startDate');
    let endDate  = req.header('endDate');
    let status  = req.header('status');

    console.log(" counselor no ringing route= ",from,status,counselorNo, campaignId, typeof(campaignId), startDate, endDate)

    if(status=="Not Interested" || status=="Registered" || status=="Not Joined")
    
{
    try{
    let totalLead = await counselorLead.find({
        finalDate:{
            $gte:startDate,
            $lte:endDate,
        },
        status:status
    }
    )

    console.log("campaign id and counsellor no =",campaignId!="",counselorNo,totalLead)

    let filterData = totalLead.filter(data=>{

        return((campaignId==""?true:data.campaignId==campaignId ) && (counselorNo==""?true:data.counsellorNo==counselorNo) && (from==""?true:data.finalStatusFrom==from))

    })

    // console.log("total lead =",totalLead)

    res.send({"filterData":filterData,"leadLength":totalLead.length, "totalLead":filterData, "status":true})
    }
    
    catch(error){
        console.log("error from total lead route=",error.message)
        res.send({"error":error.message, "status":false})
    }
}
else{
    try{
        let totalLead = await counselorLead.find({
            scheduleDate:{
                $gte:startDate,
                $lte:endDate,
            },
            status:status
        }
        )
    
        console.log("campaign id and counsellor no =",campaignId!="",counselorNo,totalLead)
    
        let filterData = totalLead.filter(data=>{
    
            return((campaignId==""?true:data.campaignId==campaignId ) && (counselorNo==""?true:data.counsellorNo==counselorNo) && (from==""?true:data.finalStatusFrom==from))
    
        })
    
        // console.log("total lead =",totalLead)
    
        res.send({"filterData":filterData,"leadLength":totalLead.length, "totalLead":filterData, "status":true})
        }
        
        catch(error){
            console.log("error from total lead route=",error.message)
            res.send({"error":error.message, "status":false})
        }
}
})




// router to get filter follow up

router.get('/getcounselorFollowUpFilter',async(req,res)=>{

    let counselorNo  = req.header('counselorNo');
    let campaignId  = req.header('campaignId');
    let startDate  = req.header('startDate');
    let endDate  = req.header('endDate');

    console.log(" counselor no start and end date = ",counselorNo, campaignId, typeof(campaignId), startDate, endDate)

    try{
    let totalLead = await counselorsfollowUp.find({
        lastFollowUpDate:{
            $gte:startDate,
            $lte:endDate,
        }
    }
    )

    // let AlltotalLead = await counselorLead.find()
    // console.log("campaign id and counsellor no =",campaignId!="",counselorNo)

    let filterData = totalLead.filter(data=>{
        // console.log("data.created_time>=startDate =",data.counsellorNo==counselorNo)
        
        if(campaignId!="" && counselorNo!=""){
            return(data.campaignId==campaignId && data.counselorNo==counselorNo)
        }
        else if(campaignId!=""){
            return(data.campaignId==campaignId)
        }

        else if(counselorNo!=""){
            return(data.counselorNo==counselorNo)
        }
        else{
            return true
        }
    })


    // console.log("total lead =",totalLead)

    res.send({"filterData":filterData,"leadLength":totalLead.length, "totalLead":filterData, "status":true})
    }
    catch(error){
        console.log("error from total lead route=",error.message)
        res.send({"error":error.message, "status":false})
    }
    
})


// route to get follow up filter data

router.get('/getcounselorDemoFilter',async(req,res)=>{

    let counselorNo  = req.header('counselorNo');
    let campaignId  = req.header('campaignId');
    let startDate  = req.header('startDate');
    let endDate  = req.header('endDate');

    console.log(" counselor no start and end date demo filter = ",counselorNo, campaignId, typeof(campaignId), startDate, endDate)

    try{
    let totalLead = await counselorDemo.find({
        reschedule:{
            $gte:startDate,
            $lte:endDate,
        }
    }
    )

    // let AlltotalLead = await counselorLead.find()
    // console.log("campaign id and counsellor no =",campaignId!="",counselorNo)

    let filterData = totalLead.filter(data=>{
        // console.log("data.created_time>=startDate =",data.counsellorNo==counselorNo)
        
        if(campaignId!="" && counselorNo!=""){
            return(data.campaignId==campaignId && data.counselorNo==counselorNo)
        }
        else if(campaignId!=""){
            return(data.campaignId==campaignId)
        }

        else if(counselorNo!=""){
            return(data.counselorNo==counselorNo)
        }
        else{
            return true
        }
    })


    // console.log("total lead =",totalLead)

    res.send({"filterData":filterData,"leadLength":totalLead.length, "totalLead":filterData, "status":true})
    }
    catch(error){
        console.log("error from total lead route=",error.message)
        res.send({"error":error.message, "status":false})
    }
    
})


// route to get filter visit data

router.get('/getcounselorVisitFilter',async(req,res)=>{

    let counselorNo  = req.header('counselorNo');
    let campaignId  = req.header('campaignId');
    let startDate  = req.header('startDate');
    let endDate  = req.header('endDate');

    console.log(" counselor no start and end date = ",counselorNo, campaignId, typeof(campaignId), startDate, endDate)

    try{
    let totalLead = await counselorsvisit.find({
        visitDate:{
            $gte:startDate,
            $lte:endDate,
        }
    }
    )
    // let AlltotalLead = await counselorLead.find()
    // console.log("campaign id and counsellor no =",campaignId!="",counselorNo)

    let filterData = totalLead.filter(data=>{
        // console.log("data.created_time>=startDate =",data.counsellorNo==counselorNo)

        
        if(campaignId!="" && counselorNo!=""){
            return(data.campaignId==campaignId && data.counselorNo==counselorNo)
        }
        else if(campaignId!=""){
            return(data.campaignId==campaignId)
        }

        else if(counselorNo!=""){
            return(data.counselorNo==counselorNo)
        }
        else{
            return true
        }
    })


    // console.log("total lead =",totalLead)

    res.send({"filterData":filterData,"leadLength":totalLead.length, "totalLead":filterData, "status":true})
    }
    catch(error){
        console.log("error from total lead route=",error.message)
        res.send({"error":error.message, "status":false})
    }
    
})

// route to get counselor total visit

router.get('/getcounselorVisitCount',async(req,res)=>{

    let counselorNo  = req.header('counselorNo');
    let startDate  = req.header('startDate');
    let endDate  = req.header('endDate');

    console.log("counselor no  =",counselorNo, startDate, endDate)

    try{
    let totalLead = await counselorsvisit.find({counselorNo:counselorNo,
        visitDate:{
            $gte:startDate,
            $lte:endDate,
        }}
    )
    let totalRevisit = await counselorsvisit.find({counselorNo:counselorNo,
        visitDate:{
            $gte:startDate,
            $lte:endDate,
        }}
    )
 
    res.send({"totalLead":totalLead, "totalRevisit":totalRevisit, "status":true})
    }
    catch(error){
        console.log("error from total lead route=",error.message)
        res.send({"error":error.message, "status":false})
    }
    
})

// route to get all trainer details



router.get('/getTrainers',async(req,res)=>{

    try{
    let trainerData = await trainer.find({})
   
 
    res.send({"trainerData":trainerData, "status":true})
    }
    catch(error){
        console.log("error from total lead route=",error.message)
        res.send({"error":error.message, "status":false})
    }
    
})

// get ad data of counsellor

router.get('/getCounsellorAd',async(req,res)=>{

    let counselorNo  = req.header('counselorNo');

    try{
    let cousnellorData = await counselors.findOne({ counselorNo:counselorNo })

    res.send({"cousnellorDataAd":cousnellorData.assignedAd, "status":true})
    }
    catch(error){
        console.log("error from total lead route=",error.message)
        res.send({"error":error.message, "status":false})
    }
    
})

// route to get total follow up 

router.get('/getcounselorFollowUpCount',async(req,res)=>{

    let counselorNo  = req.header('counselorNo');
    let startDate  = req.header('startDate');
    let endDate  = req.header('endDate');

    console.log("counselor no  =",counselorNo, startDate, endDate)

    try{

    let totalLead = await counselorsfollowUp.find({counselorNo:counselorNo,
        lastFollowUpDate:{
            $gte:startDate,
            $lte:endDate,
        }}
    )

    let totalCount = totalLead.length;
 
    res.send({"totalLead":totalLead, "status":true, totalCount:totalCount})
      
    }
    catch(error){
        console.log("error from total lead route=",error.message)
        res.send({"error":error.message, "status":false})
    }
    
})

// route to get re follow up data

router.get('/getcounselorReFollowUp',async(req,res)=>{

    let counselorNo  = req.header('counselorNo');
    let startDate  = req.header('startDate');
    let endDate  = req.header('endDate');

    console.log("counselor no  =",counselorNo, startDate, endDate)

    try{
        
    let totalFollowUp = await counselorsfollowUp.find({counselorNo:counselorNo,
        lastFollowUpDate:{
            $gte:startDate,
            $lte:endDate,
        }}
    )

    let totalCount = totalFollowUp.length;
 
    res.send({"totalFollowUp":totalFollowUp, "status":true, totalCount:totalCount})

    }
    catch(error){
        console.log("error from total lead route=",error.message)
        res.send({"error":error.message, "status":false})
    }
    
})

// route to get total demo


router.get('/getcounselorDemoCount',async(req,res)=>{

    let counselorNo  = req.header('counselorNo');
    let startDate  = req.header('startDate');
    let endDate  = req.header('endDate');

    console.log("counselor no  =",counselorNo, startDate, endDate)

    try{

    let totalLead = await counselorsdemo.find({counselorNo:counselorNo,
        reschedule:{
            $gte:startDate,
            $lte:endDate,
        }}
    )

    console.log("totalLead  =",totalLead)
    let totalCount = 0;

    totalLead.map(data=>{
        totalCount = totalCount + data.demoStudent.length;
    }

    )
 
    res.send({"totalLead":totalLead, "status":true, totalCount:totalCount})
    }
    catch(error){
        console.log("error from total lead route=",error.message)
        res.send({"error":error.message, "status":false})
    }
    
})



// route to get demo reschedule data

router.get('/getcounselorDemoReschedule',async(req,res)=>{

    let counselorNo  = req.header('counselorNo');
    // let date  = req.header('date');

    let startDate = req.header('startDate');
    let endDate = req.header('endDate');

    console.log("counselor no  =",counselorNo, startDate, endDate)

    try{
    let totalLead = await demoReschedule.find({counselorNo:counselorNo,
        reschedule:{
            $gte:startDate,
            $lte:endDate,
        }}
    )

    let totalCount = totalLead.length;
 
    res.send({"totalLead":totalLead, "status":true, totalCount:totalCount})
    }
    catch(error){
        console.log("error from total lead route=",error.message)
        res.send({"error":error.message, "status":false})
    }
    
})


// route to get counselor data by date range

router.get('/getCounselorLeadRangeData', async(req,res)=>{
    try{
    let rangeCounselorLeadData = await counselorLead.find({date:{$gt:"2024-07-08"}})

    res.send({"msg":rangeCounselorLeadData});
    }
    catch(error){
        res.send({"error":error.message})
    }
})


// end of google-sheet

// add Student route


//function to generate enrollment 

const generateEnrollment = (student, data)=>{
    console.log('generate enrollment =', data)
    let course = '';
    let splitCourse = data.Course.split(' ')
    if (splitCourse.length > 1) {
        splitCourse.map(data => {
            course = `${course}${data[0]}`
        })
    }

    else {
        course = splitCourse[0]
    }
    let newEnrollment;
    let year = data.BatchStartDate.split('-')[0]
    let month = data.BatchStartDate.split('-')[1]
    if(student){
            
    let count = parseInt(student.EnrollmentNo.split('/')[2].split('-')[1]);
    count = count+1
    count = count.toString().padStart(2, '0')
    
    newEnrollment = `UC${year}/${course}/${month}-${count}`
    console.log('enrollment no =',newEnrollment)

        }
        else{
            newEnrollment = `UC${year}/${course}/${month}-01`
        }

    return newEnrollment
}

// function to generate counselor Enrollment

// Trainer profile
router.get("/trainer", async (req, res) => {
    console.log('trainer =', req.body)

    try {
        const trainers = await trainer.find({});
        // console.log("data =",trainers)
        res.send(trainers)
    }
    catch (error) {
        console.log('error =', error.message)
        res.send({ "error": error.message })
    }

});



router.post("/counsellor", async (req, res) => {
    console.log("counsellor =",req.body)
    try {
        const counselorNo = req.body.counselorNo;
        const password = req.body.password;
        // console.log('email =',email, password)

        const username = await counselors.findOne({ counselorNo: counselorNo, password: password }).lean();
        // console.log('status =', username)

        if (username) {

            const data = {
                user: {
                    id: username._id
                },
            }

            delete username.password;
            // // console.log('trim user =', username)
            const authtoken = await jwt.sign(data, jwt_secret)
            res.send({ "status": "active", "authtoken": authtoken, "username": username })


        }
        else {
            
            res.send({ "status": "false" })
        }

    } catch (error) {
        res.status(404).send({ "invalid Password": error.message })
    }
})


// Login router for Trainer

router.post("/trainer", async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;

        const username = await trainer.findOne({ Email: email, Password: password }).lean();


        if (username) {

            const data = {
                user: {
                    id: username._id
                },
            }

            delete username.password;
            // // console.log('trim user =', username)
            const authtoken = await jwt.sign(data, jwt_secret)
            res.send({ "status": "active", "authtoken": authtoken, "username": username })
        }

        else {
            res.send({ "status": "false" })
        }

    } catch (error) {
        res.status(404).send({ "invalid ": error.message })
    }
})

router.post("/counselor", async (req, res) => {
    console.log('counselor')

    try {
        const email = req.body.email;
        const password = req.body.password;

        const username = await counselors.findOne({ Email: email, Password: password }).lean();


        if (username) {

            const data = {
                user: {
                    id: username._id
                },
            }

            delete username.password;
            // // console.log('trim user =', username)
            const authtoken = await jwt.sign(data, jwt_secret)
            res.send({ "status": "active", "authtoken": authtoken, "username": username })
        }

        else {
            res.send({ "status": "false" })
        }

    } catch (error) {
        res.status(404).send({ "invalid ": error.message })
    }
})

router.post("/admin", async (req, res) => {
    console.log('admin =', req.body)
    try {
        const email = req.body.email;
        const password = req.body.password;

        const username = await admins.findOne({ email: email, password: password }).lean();
        console.log('status =', username)

        if (username) {

            if (username.status === "active") {
                const data = {
                    user: {
                        id: username._id
                    },
                }

                delete username.password;
                // // console.log('trim user =', username)
                const authtoken = await jwt.sign(data, jwt_secret)
                res.send({ "status": "active", "authtoken": authtoken, "username": username })
            }

            else {
                res.send({ "status": "deactive" })

            }
        }
        else {
            res.send({ "status": "false" })
        }

    } catch (error) {
        console.log('error =', error.message)
        res.status(404).send({ "invalid Password": error.message })
    }
})





// For Demo------


router.post('/fetchadmin', fetchuser, async (req, res) => {
    // // console.log('id =', req.user)

    try {
        let adminData = await admins.findOne({ _id: req.user.id })

        if (adminData) {
            res.send({ "status": "active", "data": adminData })
        }

        else {
            res.send({ "status": "deactive" })
        }
    }
    catch (error) {
        res.send({ "status": "server error" })
    }
})


router.post('/fetchcounselor', fetchuser, async (req, res) => {
    // // console.log('id =', req.user)

    try {
        let counselorData = await counselors.findOne({ _id: req.user.id })

        // // console.log('trainer data= ',trainerData)
        if (counselorData) {
            res.send({ "status": "active", "data": counselorData })
        }

        else {
            res.send({ "status": "deactive" })
        }
    }
    catch (error) {
        res.send({ "status": "server error" })
    }
})
router.get('/fetchcounselor/:id', async (req, res) => {
    // // console.log('id =', req.user)
    const {id}  = req.params
    console.log("id  =",id)

    try {
        let counselorData = await counselors.findOne({ _id: id })

        // // console.log('trainer data= ',trainerData)
        if (counselorData) {
            res.send({ "status": "active", "data": counselorData })
        }

        else {
            res.send({ "status": "deactive" })
        }
    }
    catch (error) {
        res.send({ "status": "server error" })
    }
})

router.get('/getAllCounselor', async (req, res) => {
    try {
        const counselorData = await counselors.find({});
        res.send({ "status": "active", "counselorData": counselorData })
    }
    catch (error) {
        res.send({ "status": "error" })

    }
})


router.get("/counselor/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // console.log('id =',id)

        const userindividual = await counselors.findById(id);
        // // console.log("user individual =", userindividual);
        res.send({ "status": "active", "userIndividual": userindividual });
    } catch (error) {
        res.status(500).json(error);
    }
});



module.exports = router;






