const { GoogleSpreadsheet } = require('google-spreadsheet');
const express = require("express");
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const { auth } = require('google-auth-library');
const router = express.Router();
const app = express();

const trainer = require("../models/teachermodal");
const bodyParser = require('body-parser');
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const admins = require("../models/Admin")
const compiler = require('compilex');
const counselors = require("../models/Counselor")
const counselorsdemo = require("../models/CounselorDemo")
const counselorsfollowUp = require("../models/CounselorFollowUp")
const counselorsvisit = require("../models/CounselorVisit")
const options = { stats: true }
compiler.init(options)
const counselorLead = require("../models/CounselorLead");
const counselorDemo = require('../models/CounselorDemo');
const Expiry  =  require("../models/Expiry")
const latestData  =  require("../models/LatestData")

const totalRegistration = require("../models/TotalRegistrationNo");
const subCourse = require("../models/Subcourse");
const registerStudentDev = require("../models/RegisterStudentDev");
const sendmail = require('../controller/sendmail');
const { JWT } = require('google-auth-library');

const jwt_secret = "uuu"

// home route


router.get('/',async(req,res)=>{
    res.send({"status":"running"})
})

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
    let activeCampaignsResponse = await fetch('https://blockey.in:8001/getfacebookCampaignData');
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
       },{$set:{finalStatus:data.finalStatus,finalDate:data.finalDate,finalStatusFrom:data.finalStatusFrom}},
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
               },{$set:{finalStatus:data.finalStatus,finalDate:data.finalDate,finalStatusFrom:data.finalStatusFrom}},
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
               },{$set:{finalStatus:data.finalStatus,finalDate:data.finalDate,finalStatusFrom:data.finalStatusFrom}},
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

    console.log(" counselor no start and end date follow up = ",counselorNo, campaignId, typeof(campaignId), startDate, endDate)

    try{
    let totalLead = await counselorsfollowUp.find({
        lastFollowUpDate:{
            $gte:startDate,
            $lte:endDate,
        },
        status: { $ne: "Changed" }
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
        },
        status: { $ne: "Changed" }
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
        },
        visitStatus: { $ne: "Changed" }
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

// router.get('/getCounsellorAd',async(req,res)=>{

//     let counselorNo  = req.header('counselorNo');

//     try{
//     let cousnellorData = await counselors.findOne({ counselorNo:counselorNo })

//     res.send({"cousnellorDataAd":cousnellorData.assignedAd, "status":true})
//     }
//     catch(error){
//         console.log("error from total lead route=",error.message)
//         res.send({"error":error.message, "status":false})
//     }
    
// })

// route to get total follow up 

// route to get re follow up data


// route to get total demo


// route to get demo reschedule data

// route to get counselor data by date range



// end of google-sheet

// add Student route


//function to generate enrollment 


// function to generate counselor Enrollment

// Trainer profile




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




router.post('/editremarks',async(req,res)=>{
    const data = req.body

    console.log("data edit remarks =",data)

        
    try{
    if(data.status=="demo"){

        const updateDemoRemarks = await counselorDemo.findOneAndUpdate(
            { "id": data.id }, 
                        { 
              $set: { "demoRecord": data.record } 
            },
            { new: true } 
          );
          if(updateDemoRemarks){
            res.send({"status":true})
          }
        
    }
    else if(data.status=="followup"){

        const updateFollowRemarks = await counselorsfollowUp.findOneAndUpdate(
            { "id": data.id }, 
                        { 
              $set: { "FollowUp": data.record } 
            },
            { new: true } 
          );

          if(updateFollowRemarks){
            res.send({"status":true})
          }

    }
    else if(data.status=="visit"){
        const updateVisitRemarks = await counselorsvisit.findOneAndUpdate(
            { "id": data.id }, 
                        { 
              $set: { "visitRecord": data.record } 
            },
            { new: true } 
          );

          if(updateVisitRemarks){
            res.send({"status":true})
          }
    }
}
catch(error){
    console.log("edit remarks error =",error.message)
    res.send({"status":false})
}
})

// route of registration receipt


router.post("/google-sheet-data",async(req,res) =>{

    console.log("index no is from google sheet data route=",req.body.month)

const beforeMemoryUsage = process.memoryUsage();
    try{
          
    const serviceAccountAuth = new JWT({
        // env var values here are copied from service account credentials generated by google
        // see "Authentication" section in docs for more info
        email: 'registrationgooglesheet@optical-wall-409909.iam.gserviceaccount.com',
        key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCNFZEHF0DuPXs+\nDcW3tnCO7K5R0AhBGFljvbyKn5QtNm6fgrTit4CSw49wtVDWxosjk8zSeBThc0Xw\nk4MneJe0o1xVKJ92Yl7CfGj9VbeBX/iuSGDsw7YO5H1s99dWnhlvZXx8BXpt/Hjm\nEpeFPhwZMvg7T+aQZDOlxyZhpvFK7NVF+L6kkGjCG+ZauEzmPzKKH6ULAw2IwPyd\ncwFcGAIcp69EJIE8gzaCRpOeSC2USd5oBkkAGs1xEy/qu1a2Px7bKtlTUj7nq546\nokzNFJqSYBZyxOr0g/OdCEQx5m1fnseBZEf1aDRENn7fRy/W10NRRFoxCIxKVe9g\n6H6albuLAgMBAAECggEAQP7egVXFI/xO+pd9rtTtpeqDpE0igFqnU7vlUDeUHAAn\nlnSwwIGpSfOt8U6Wn1t4XjuI8K1BcVuZrOtIULbNrPpVXyYH0JIg9Zg7BfqnP4Ln\nHeNaQ7kl9lZtMfY7zjunnBo07y3W6TSWvedyxn+GklVY5no4zexbntPQasxt/QXP\nQzQqk+EkvdHu/C1S3kVs45TD0gwjjBXfYAv1XnmwXcH2UGJsCjh+keNVdmFWKb1+\np2Milo86rbe656jH+BycPwgv+Ag0FX13CBh5/4uFg9vRlr1l5OiUaWETQlSusp+5\ncJ4LvR7X1034RIqJDdjPXBAT2Td/SBDs42GJIyTpAQKBgQDE+f4dtZVscxFe3cjB\nBepiTPVEDl2ofE/9/XHDdT7GAj3gNpt8Njfxcrp/Iyxah1RJX4norQ9Yo3mpzRBi\nOFktfQLjqv6sHINn35w5Ab9gAp/1TyAtBgPtu9h38TnjyKptQaj8jHLvgLqrENYJ\nn/mK9A0bdwNiL+BSw6eVpNzC4wKBgQC3XBgWNzDFgkQUDZYD+ixKZZRn+9UZ9MF7\nhbmzTJr5bbEiVNIsZVtW4Weo0O1SEys7/talBj4vO5qJPcoGhxWo9agJMQHvm6lC\nYfJjXJVa/aC+n+vb5OF8tKRc17zO/PzuzJ/JE6uyMXV0aZ57V0Y0uklsxiJCqZWW\nM5V1eBz9OQKBgAQ8H7OB0OmY+7mfaQ6FUwmz/93rtSXHLm0Wgtih76yQJcZpRiSA\ngell/w52siBsImrFbBCdj+Pm99mnt/90mK46rtI4PetzXXvhOdmb6QJmbAv5HIb7\nRyBYVooVnJoCGW/p5nkvh9UQXnMJFKD2WIYdQx7hCyiUQO1mmXbFKZ3jAoGAHPXH\nvCKFanyTohMvQXuO6UU39mB5HPtiX88UMHSF+aVQl9qLw4VSstsxEyHEifULHBO4\n9SGSSsWAN/LxaKyHSENcge8iniSYzCpKLVVfJZrve4wopXd2ActKNnvAj3S3wkPB\nbPHVaXSUV4mjBVoYdZWCqVJ18M92F94X2hDZi0kCgYARpi6PQL4F3bcIwGDwA5lh\nRaZ7tv9DZi6WvJRjy1Kd65oxyljPImcPaxt7I+HuVikub3a1uFoFM/Kk7NJbNHVy\nTaJX84JQSfpLGn9l7beimzGuho8obEJOZKWtK4SIdtgh9p62ji7I6NFKdsfA4myO\nKY9vH2DLSFlOVHibsKmFgg==\n-----END PRIVATE KEY-----\n',
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
        ],
      });

    // const doc = new GoogleSpreadsheet('1Uyn8D87__CUhM0m08kpS63cD2nbw7DI6j3bVUkWZm_4', serviceAccountAuth);
    const doc = new GoogleSpreadsheet('1_PMdmi3cd24bTEt3IVANPUvMxYQCQ8t-0zxNSOOF_JU', serviceAccountAuth);
    // const doc = new GoogleSpreadsheet('1Bjm39FwtIFSQKL5Xc-jBp5OpmQt3czMPYLbMWit6r5Q', serviceAccountAuth);

    await doc.loadInfo(); // loads document properties and worksheets
    const index = parseInt(req.body.month)-1

    let sheet;
    if (index < doc.sheetCount) {
      // If the sheet exists, use it
      sheet = doc.sheetsByIndex[index];
    } else {
      // If the sheet doesn't exist, create sheets until the specified index is reached
      for (let i = doc.sheetCount; i <= index; i++) {
        sheet = await doc.addSheet({ title: `Sheet ${i + 1}` }); // You can customize the title as needed
      }
    }
   
      
      console.log(doc.title);
      await doc.updateProperties({ title: 'Admission Details 2024' });

      const HEADERS = ['Enrollment_Id','Counselor_Name','Student_Name','Email_ID','Contact_No', 'Course_Name','Total_Amount','Registation_Amount','Date_of_Reg','Expected_Batch_Allocation','Batch_Allocation','Payment_Method','Total_Installment','Batch_Mode','Remark']
      await sheet.setHeaderRow(HEADERS)

      let data = { 
        Enrollment_Id: req.body.RegistrationNo,
        Counselor_Name:  req.body.Counselor,
        Guardian_Name: req.body.pname, 
        Student_Name: req.body.Name,
        Email_ID: req.body.Email,
        Contact_No: req.body.Number,
        Course_Name: req.body.subCourse,
        Total_Amount: req.body.CourseFees,
        Registation_Amount:req.body.RegistrationFees,
        Date_of_Reg:req.body.RegistrationDate,
        Expected_Batch_Allocation:req.body.joinDate,
        Batch_Allocation:"",
        Payment_Method:req.body.PaymentMethod,
        Batch_Mode:req.body.BatchMode,
        Remark:req.body.Remark,
        Total_Installment:req.body.totalInstallment
    }
    //   ['S.No','Counselor_Name','Enrollment_Id','Student_Name','Email_ID','Contact_No.', 'Course_ Name','Total_Amount','Registation_Amount','Date_of_Reg.','Batch_Allocation','Payment_Mode','Batch_Mode','Remark']

      await sheet.addRow(data)
      
        // Reload the sheet to get the updated data
    await sheet.loadCells();

    sheet.rowCount;

    let usedRowCount = 0;

    // Iterate through rows and check if they have values
    for (let i = 0; i < sheet.rowCount; i++) {
        const cell = sheet.getCell(i, 0); // Assuming checking the first column for data
        if (cell.value !== null) {
            usedRowCount++;
        } else {
            break; // Stop checking once an empty row is encountered
        }
    }

    console.log('row count number =',usedRowCount)

    let updateRegister = await registerStudentDev.updateOne({RegistrationNo:req.body.RegistrationNo},{index:usedRowCount})

    // Find the added row based on some criteria (for example, Enrollment_Id)
    const addedRow = sheet.getRows({ offset: 1, limit: 1, query: 'Enrollment_Id = ' + req.body.RegistrationNo })[0];

    if (addedRow) {
      const addedRowId = addedRow._rowNumber; // This is the row number, you can use it as an ID
      console.log('Added row ID:', addedRowId);
      res.json({ "status": true, "id": addedRowId });
    } else {
      res.json({ "status": false });
    }
           const afterMemoryUsage = process.memoryUsage();

        console.log(`Memory before operation google-sheet  route: ${beforeMemoryUsage.heapUsed / 1024 / 1024} MB`);
        console.log(`Memory after operation  google-sheet route: ${afterMemoryUsage.heapUsed / 1024 / 1024} MB`);
  } catch (error) {
    res.json({ "status": false });
    console.log('error =', error.message);
  }
    

})




// end of google-sheet data submit


router.post('/edit-google-sheet', async (req, res) => {
    console.log("Received edit request for Enrollment_Id:", req.body.RegistrationNo,req.body.oldRegistrationNo);

    try {
        const serviceAccountAuth = new JWT({
            email: 'registrationgooglesheet@optical-wall-409909.iam.gserviceaccount.com',
            key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCNFZEHF0DuPXs+\nDcW3tnCO7K5R0AhBGFljvbyKn5QtNm6fgrTit4CSw49wtVDWxosjk8zSeBThc0Xw\nk4MneJe0o1xVKJ92Yl7CfGj9VbeBX/iuSGDsw7YO5H1s99dWnhlvZXx8BXpt/Hjm\nEpeFPhwZMvg7T+aQZDOlxyZhpvFK7NVF+L6kkGjCG+ZauEzmPzKKH6ULAw2IwPyd\ncwFcGAIcp69EJIE8gzaCRpOeSC2USd5oBkkAGs1xEy/qu1a2Px7bKtlTUj7nq546\nokzNFJqSYBZyxOr0g/OdCEQx5m1fnseBZEf1aDRENn7fRy/W10NRRFoxCIxKVe9g\n6H6albuLAgMBAAECggEAQP7egVXFI/xO+pd9rtTtpeqDpE0igFqnU7vlUDeUHAAn\nlnSwwIGpSfOt8U6Wn1t4XjuI8K1BcVuZrOtIULbNrPpVXyYH0JIg9Zg7BfqnP4Ln\nHeNaQ7kl9lZtMfY7zjunnBo07y3W6TSWvedyxn+GklVY5no4zexbntPQasxt/QXP\nQzQqk+EkvdHu/C1S3kVs45TD0gwjjBXfYAv1XnmwXcH2UGJsCjh+keNVdmFWKb1+\np2Milo86rbe656jH+BycPwgv+Ag0FX13CBh5/4uFg9vRlr1l5OiUaWETQlSusp+5\ncJ4LvR7X1034RIqJDdjPXBAT2Td/SBDs42GJIyTpAQKBgQDE+f4dtZVscxFe3cjB\nBepiTPVEDl2ofE/9/XHDdT7GAj3gNpt8Njfxcrp/Iyxah1RJX4norQ9Yo3mpzRBi\nOFktfQLjqv6sHINn35w5Ab9gAp/1TyAtBgPtu9h38TnjyKptQaj8jHLvgLqrENYJ\nn/mK9A0bdwNiL+BSw6eVpNzC4wKBgQC3XBgWNzDFgkQUDZYD+ixKZZRn+9UZ9MF7\nhbmzTJr5bbEiVNIsZVtW4Weo0O1SEys7/talBj4vO5qJPcoGhxWo9agJMQHvm6lC\nYfJjXJVa/aC+n+vb5OF8tKRc17zO/PzuzJ/JE6uyMXV0aZ57V0Y0uklsxiJCqZWW\nM5V1eBz9OQKBgAQ8H7OB0OmY+7mfaQ6FUwmz/93rtSXHLm0Wgtih76yQJcZpRiSA\ngell/w52siBsImrFbBCdj+Pm99mnt/90mK46rtI4PetzXXvhOdmb6QJmbAv5HIb7\nRyBYVooVnJoCGW/p5nkvh9UQXnMJFKD2WIYdQx7hCyiUQO1mmXbFKZ3jAoGAHPXH\nvCKFanyTohMvQXuO6UU39mB5HPtiX88UMHSF+aVQl9qLw4VSstsxEyHEifULHBO4\n9SGSSsWAN/LxaKyHSENcge8iniSYzCpKLVVfJZrve4wopXd2ActKNnvAj3S3wkPB\nbPHVaXSUV4mjBVoYdZWCqVJ18M92F94X2hDZi0kCgYARpi6PQL4F3bcIwGDwA5lh\nRaZ7tv9DZi6WvJRjy1Kd65oxyljPImcPaxt7I+HuVikub3a1uFoFM/Kk7NJbNHVy\nTaJX84JQSfpLGn9l7beimzGuho8obEJOZKWtK4SIdtgh9p62ji7I6NFKdsfA4myO\nKY9vH2DLSFlOVHibsKmFgg==\n-----END PRIVATE KEY-----\n',
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        // const doc = new GoogleSpreadsheet('1Bjm39FwtIFSQKL5Xc-jBp5OpmQt3czMPYLbMWit6r5Q', serviceAccountAuth);
        const doc = new GoogleSpreadsheet('1_PMdmi3cd24bTEt3IVANPUvMxYQCQ8t-0zxNSOOF_JU', serviceAccountAuth);

        await doc.loadInfo(); // loads document properties and worksheets

        let sheetIndex = parseInt(req.body.month) - 1;
        const sheet = doc.sheetsByIndex[sheetIndex];

        await sheet.loadCells(); // Load the sheet cells

        // Find the row with matching Enrollment_Id (RegistrationNo)
        let rowIndex = null;
        for (let i = 1; i <= sheet.rowCount; i++) {
            let enrollmentCell = sheet.getCellByA1(`A${i}`);
            if (enrollmentCell.value == req.body.oldRegistrationNo) {
                rowIndex = i;
                break;
            }
        }

        if (rowIndex === null) {
            return res.json({ "status": false, "message": "Enrollment_Id not found" });
        }

        // Now update the cells in the row
        let Enrollment_Id = sheet.getCellByA1(`A${rowIndex}`);
        let Counselor_Name = sheet.getCellByA1(`B${rowIndex}`);
        let Student_Name = sheet.getCellByA1(`C${rowIndex}`);
        let Email_ID = sheet.getCellByA1(`D${rowIndex}`);
        let Contact_No = sheet.getCellByA1(`E${rowIndex}`);
        let Course_Name = sheet.getCellByA1(`F${rowIndex}`);
        let Total_Amount = sheet.getCellByA1(`G${rowIndex}`);
        let Registation_Amount = sheet.getCellByA1(`H${rowIndex}`);
        let Date_of_Reg = sheet.getCellByA1(`I${rowIndex}`);
        let Expected_Batch_Allocation = sheet.getCellByA1(`J${rowIndex}`);
        let Batch_Allocation = sheet.getCellByA1(`K${rowIndex}`);
        let Payment_Method = sheet.getCellByA1(`L${rowIndex}`);
        let Total_Installment = sheet.getCellByA1(`M${rowIndex}`);
        let Batch_Mode = sheet.getCellByA1(`N${rowIndex}`);
        let Remark = sheet.getCellByA1(`O${rowIndex}`);

        Enrollment_Id.value = req.body.RegistrationNo;
        Counselor_Name.value = req.body.Counselor;
        Student_Name.value = req.body.Name;
        Email_ID.value = req.body.Email;
        Contact_No.value = req.body.Number;
        Course_Name.value = req.body.subCourse;
        Total_Amount.value = req.body.CourseFees;
        Registation_Amount.value = req.body.RegistrationFees;
        Payment_Method.value = req.body.PaymentMethod;
        Date_of_Reg.value = req.body.RegistrationDate;
        Expected_Batch_Allocation.value = req.body.joinDate;
        Batch_Allocation.value = "";  // Set Batch Allocation to empty
        Total_Installment.value = req.body.totalInstallment;
        Batch_Mode.value = req.body.BatchMode;
        Remark.value = req.body.Remark;

        await sheet.saveUpdatedCells(); // Save the changes

        res.json({ "status": true });
    } catch (error) {
        console.log('Error editing Google Sheet:', error.message);
        res.json({ "status": false, "error": error.message });
    }
});

  

// end of google-sheet



// get all sub course and main course router

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



// get userdata




router.post("/updateRegisterStudent", async (req, res) => {
    
    // console.log("register route =", req.body)
    try {
    const totalMonthRegistration = await totalRegistration.find({"month":req.body.month,"year":req.body.year})
    const Student = await registerStudentDev.findOne({"RegistrationNo":req.body.RegistrationNo})



        const updateRegistration = await updateRegisterNo(totalMonthRegistration,Student,req.body)
        console.log('update registration',updateRegistration)
        let oldRegistrationNo = req.body.RegistrationNo
        req.body.RegistrationNo = updateRegistration
       req.body.RemainingFees = req.body.CourseFees - req.body.RegistrationFees
                    console.log("RemainingFees =",req.body.RemainingFees)

    

  
        const savedUser = await registerStudentDev.updateOne({RegistrationNo:oldRegistrationNo},req.body)
        // const savedTotalRegistration = await totalRegistration.updateOne({RegistrationNo:oldRegistrationNo},req.body)
        const data = await registerStudentDev.findOne({RegistrationNo:req.body.RegistrationNo})
        req.body.oldRegistrationNo = oldRegistrationNo;      
            
       
        res.status(200).json(req.body);
        console.log('updated register student =',savedUser,data)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// update register student with mail 

router.post("/updateRegisterStudentMail", async (req, res) => {
    
    // console.log("register route =", req.body)
    try {
    const totalMonthRegistration = await totalRegistration.find({"month":req.body.month,"year":req.body.year})
    const Student = await registerStudentDev.findOne({"RegistrationNo":req.body.RegistrationNo})


        const updateRegistration = await updateRegisterNo(totalMonthRegistration,Student,req.body)
        console.log('update registration',updateRegistration)
        let oldRegistrationNo = req.body.RegistrationNo
        req.body.RegistrationNo = updateRegistration
       req.body.RemainingFees = req.body.CourseFees - req.body.RegistrationFees
                    console.log("RemainingFees =",req.body.RemainingFees)

    

  
        const savedUser = await registerStudentDev.updateOne({RegistrationNo:oldRegistrationNo},req.body)
        // const savedTotalRegistration = await totalRegistration.updateOne({RegistrationNo:oldRegistrationNo},req.body)
        const data = await registerStudentDev.findOne({RegistrationNo:req.body.RegistrationNo})
        req.body.oldRegistrationNo = oldRegistrationNo;      
            
       
        res.status(200).json(req.body);
        sendmail(req, res)
        console.log('updated register student =',savedUser,data)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});

router.post("/registerStudent", async (req, res) => {
      // const lastStudent = await registerStudentDev.findOne({}, {}, { sort: { _id: -1 } }).exec();
      try {
    const totalRegistrationNo = await totalRegistration.find({"month":req.body.month,"year":req.body.year})

    let newRegistration;
    
    newRegistration = generateRegisterNo(totalRegistrationNo,req.body)
    req.body.RegistrationNo = newRegistration
    req.body.RemainingFees = req.body.CourseFees - req.body.RegistrationFees
           
    req.body.index = "";

   
        const savedUser = await registerStudentDev.create(req.body);
        console.log('saved user =',savedUser)
        const addRegistrationNo = await totalRegistration.create(req.body)
        res.status(200).json(savedUser);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// register student and sending mail
router.post("/registerStudentMail", async (req, res) => {
      // const lastStudent = await registerStudentDev.findOne({}, {}, { sort: { _id: -1 } }).exec();
      try {
    const totalRegistrationNo = await totalRegistration.find({"month":req.body.month,"year":req.body.year})

    let newRegistration;
    
    newRegistration = generateRegisterNo(totalRegistrationNo,req.body)
    req.body.RegistrationNo = newRegistration
    req.body.RemainingFees = req.body.CourseFees - req.body.RegistrationFees
           
    req.body.index = "";

   
        const savedUser = await registerStudentDev.create(req.body);
        sendmail(req, res)
        console.log('saved user =',savedUser)
        const addRegistrationNo = await totalRegistration.create(req.body)
        res.status(200).json(savedUser);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Generate EnrollmentNo

const generateRegisterNo = (monthStudent, data) => {

   try
   {console.log("data of student =",data)
       let course = data.courseCode;
       let newStudentCourse = data.Course

    let registrationNo;
   

    let year =  data.year;
    let month = data.month;

    if (monthStudent) {
             let courseCount = 1;

            monthStudent.map(data=>{
                if(data.Course===newStudentCourse){

                    courseCount = courseCount+1
                }
            })

            courseCount  =  courseCount < 10 ? '0' + courseCount : courseCount.toString()
            registrationNo = `UC${year}/${course}-${data.counselorReference}/${month}-${courseCount}`;
        }
     else {
        registrationNo = `UC${year}/${course}-${data.counselorReference}/${month}-01`;
    }

    return registrationNo;}

    catch(error){
        console.log("error =",error.message)
        res.status(500).json({ error: "Something went wrong" });
    }
};



// update generate enrollment no

const updateRegisterNo = async(totalMonthRegistration,Student,data) => {
   
  try {
    console.log("update register =", data,Student)

    let oldRegistartion = data.RegistrationNo;
    let newRegistrationNo;
    let courseCount = oldRegistartion.split('/')[2].split('-')[1]

    let oldCourseCode = oldRegistartion.split('/')[1].split('-')[0]
    let oldMonth = oldRegistartion.split('/')[2].split('-')[0]

    let oldCourse = Student.Course;
    let newCourse = data.Course;
    let newCourseCode =data.courseCode;

    let year =  data.year;
    let month = data.month;


    if(totalMonthRegistration.length>0)
    {
        if(month===oldMonth){
        if(oldCourse===newCourse){

            if(oldCourseCode===newCourseCode){

                console.log('code is same =',newCourseCode,data.counselorReference)

                newRegistrationNo = `UC${year}/${newCourseCode}-${data.counselorReference}/${month}-${courseCount}`;
            const savedTotalRegistration = await totalRegistration.updateOne({RegistrationNo:data.RegistrationNo},data)

            }

            else{
                console.log('code is not same =',oldCourseCode,newCourseCode,data.counselorReference)
            newRegistrationNo = `UC${year}/${oldCourseCode}-${newCourseCode}-${data.counselorReference}/${month}-${courseCount}`;
            const savedTotalRegistration = await totalRegistration.updateOne({RegistrationNo:data.RegistrationNo},data)
        
            }
        }
        else{
            let count = 1;
            totalMonthRegistration.map(data=>{
                if(data.Course===newCourse){
                    count = count + 1 
                }
            })
            count = count>10?count:`0${count}`
            newRegistrationNo = `UC${year}/${oldCourseCode}-${newCourseCode}-${data.counselorReference}/${month}-${count}`;
            data.registrationNo = newRegistrationNo
            let addtotalRegister  = await totalRegistration.create(data)

        }
    }

    else{
        let count = 1
        console.log("count",count)

        totalMonthRegistration.map(data=>{
            if(data.Course===newCourse){
                count = count + 1
            }
        })

        count = count>10?count:`0${count}`

        if(oldCourseCode===newCourseCode){
            console.log('month is not same =',newCourseCode,data.counselorReference)

            newRegistrationNo = `UC${year}/${newCourseCode}-${data.counselorReference}/${month}-${count}`;
            const savedTotalRegistration = await totalRegistration.updateOne({RegistrationNo:data.RegistrationNo},data)

        }
        else{
            newRegistrationNo = `UC${year}/${oldCourseCode}-${newCourseCode}-${data.counselorReference}/${month}-${count}`;
            data.registrationNo = newRegistrationNo
            let addtotalRegister  =await totalRegistration.create(data)
            const savedTotalRegistration = await totalRegistration.updateOne({RegistrationNo:data.RegistrationNo},data)

        }

       
    }
    }

    else{
        console.log('registration no. else =')
        newRegistrationNo = `UC${year}/${newCourse}-${data.counselorReference}/${month}-01`;
        let addtotalRegister  = await totalRegistration.create(data)
    }


 return newRegistrationNo;}

 catch(error){
    console.log("error =",error.message)
    res.status(500).json({ error: "Something went wrong" });
 }
};


//Get resister student

router.get("/getregisterStudent", async (req, res) => {
    try {
        const userdata = await registerStudentDev.find();
        res.status(200).json(userdata);
    } catch (error) {
        console.log('error =', error.message)
        res.status(500).json(error);
    }
});

// get student month wise


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




router.post("/addNewCourse", async (req, res) => {

    let course = req.body.course
    console.log("course =",course)

    try {

        let data ={
            mainCourse:req.body.mainCourse,
            subCourse:[]
        }
        
        let addNewMainCourse = await subCourse.create(data)

        res.send({ "status": "active" })
    }
    catch (error) {
        res.send({ "error": error.message })
    }
})


// new Course

router.post("/addNewSubCourse", async (req, res) => {

    try {
       
        let Course = await subCourse.findOne({mainCourse:req.body.mainCourse})

        let allSubCourse = await subCourse.find({},{ subCourse: 1, _id: 0})

        let allSubCourseCode=[]

        allSubCourse.map(data=>{
            data.subCourse.map(element=>{
                allSubCourseCode.push(element.courseCode)
            })
        })



        let mainSubcourse = Course.subCourse
        let course = req.body.subCourse;
        let courseCode = req.body.courseCode;
        let codeExist = false

        for(let i=0; i<allSubCourseCode.length;i++){
            if(allSubCourseCode[i].toLowerCase() === courseCode.toLowerCase()){
                res.send({ "status": "code exist","message":"Given Course Code is already exist" })
                codeExist=true
                break;
                
            }
        }

       if(!codeExist){ data = {
            "course":course,
            "courseCode":courseCode
        }

        // mainSubcourse.push(req.body.subCourse)
        mainSubcourse.push(data)
        // let updateCourse = await subCourse.findByIdAndUpdate({_id:Course._id},{$set:{subCourse:{"course":mainSubcourse,"courseCode":courseCode}}})
        let updateCourse = await subCourse.findByIdAndUpdate({_id:Course._id},{$set:{subCourse:mainSubcourse}})

        res.send({ "status": true })}
    }
    catch (error) {
        console.log("error =",error.message)
        res.send({ "error": error.message })
    }
})


router.post("/addNewCounsellor",async(req,res)=>{
    let counsellorDetails  = req.body

    try{

    let Currentmonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
   let Currentyear  = new Date().getFullYear()

   let referenceExist=false

   let counsellorReference = await counselors.find({},{counselorReference: 1, _id: 0})

   for(let i=0; i<counsellorReference.length;i++){
    if(counsellorReference[i].counselorReference.toLowerCase()==counsellorDetails.counselorReference.toLowerCase()){
        res.send({"status":"code exist","message":"Counsellor Code already exist please choose different one"})
        referenceExist=true
        break;
    }
   }


   if(!referenceExist){const lastCounsellor = await counselors.findOne({}, {}, { sort: { _id: -1 } }).exec();

   let count = 0;
   let lastCounsellorYear  = (lastCounsellor.counselorNo.split("/")[0]).substring(2)

   if(lastCounsellorYear==Currentyear){
    count = parseInt(lastCounsellor.counselorNo.split("/")[2].split("-")[1])
   }

   let code = `UC${Currentyear}/${counsellorDetails.counselorReference}/${Currentmonth}-${(count+1)>9?(count+1):(count+1).toString().padStart(2,'0')}`

   counsellorDetails.counselorNo=code;

   let newCounsellor = await counselors.create(counsellorDetails)

   console.log("code =",code)
   res.send({"code":code,"status":true})}
}

catch(error){
    res.send({"status":false})
}
    
})

router.delete("/deleteCounsellor",async(req,res)=>{
    try{
    const id = req.header("id")
    console.log("id delete counsellor",id)

    let deleteCounsellor = await counselors.deleteOne({_id:id})

    res.send({"status":true})
    }

    catch(error){
        console.log("delete counsellor error =",error.message)
        res.send({"status":false})
    }

})
router.delete("/deleteStudent",async(req,res)=>{
    try{
    const registrationNo = req.header("registrationNo")
    console.log("registrationNo delete student",registrationNo)

    let deleteStudent = await registerStudentDev.deleteOne({RegistrationNo:registrationNo})
    let deleteTotalRegistraion = await totalRegistration.deleteOne({RegistrationNo:registrationNo})

    res.send({"status":true})
    }

    catch(error){
        console.log("delete counsellor error =",error.message)
        res.send({"status":false})
    }

})


async function authenticate() {
    const authClient = new JWT({
        email: 'registrationgooglesheet@optical-wall-409909.iam.gserviceaccount.com',
        key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCNFZEHF0DuPXs+\nDcW3tnCO7K5R0AhBGFljvbyKn5QtNm6fgrTit4CSw49wtVDWxosjk8zSeBThc0Xw\nk4MneJe0o1xVKJ92Yl7CfGj9VbeBX/iuSGDsw7YO5H1s99dWnhlvZXx8BXpt/Hjm\nEpeFPhwZMvg7T+aQZDOlxyZhpvFK7NVF+L6kkGjCG+ZauEzmPzKKH6ULAw2IwPyd\ncwFcGAIcp69EJIE8gzaCRpOeSC2USd5oBkkAGs1xEy/qu1a2Px7bKtlTUj7nq546\nokzNFJqSYBZyxOr0g/OdCEQx5m1fnseBZEf1aDRENn7fRy/W10NRRFoxCIxKVe9g\n6H6albuLAgMBAAECggEAQP7egVXFI/xO+pd9rtTtpeqDpE0igFqnU7vlUDeUHAAn\nlnSwwIGpSfOt8U6Wn1t4XjuI8K1BcVuZrOtIULbNrPpVXyYH0JIg9Zg7BfqnP4Ln\nHeNaQ7kl9lZtMfY7zjunnBo07y3W6TSWvedyxn+GklVY5no4zexbntPQasxt/QXP\nQzQqk+EkvdHu/C1S3kVs45TD0gwjjBXfYAv1XnmwXcH2UGJsCjh+keNVdmFWKb1+\np2Milo86rbe656jH+BycPwgv+Ag0FX13CBh5/4uFg9vRlr1l5OiUaWETQlSusp+5\ncJ4LvR7X1034RIqJDdjPXBAT2Td/SBDs42GJIyTpAQKBgQDE+f4dtZVscxFe3cjB\nBepiTPVEDl2ofE/9/XHDdT7GAj3gNpt8Njfxcrp/Iyxah1RJX4norQ9Yo3mpzRBi\nOFktfQLjqv6sHINn35w5Ab9gAp/1TyAtBgPtu9h38TnjyKptQaj8jHLvgLqrENYJ\nn/mK9A0bdwNiL+BSw6eVpNzC4wKBgQC3XBgWNzDFgkQUDZYD+ixKZZRn+9UZ9MF7\nhbmzTJr5bbEiVNIsZVtW4Weo0O1SEys7/talBj4vO5qJPcoGhxWo9agJMQHvm6lC\nYfJjXJVa/aC+n+vb5OF8tKRc17zO/PzuzJ/JE6uyMXV0aZ57V0Y0uklsxiJCqZWW\nM5V1eBz9OQKBgAQ8H7OB0OmY+7mfaQ6FUwmz/93rtSXHLm0Wgtih76yQJcZpRiSA\ngell/w52siBsImrFbBCdj+Pm99mnt/90mK46rtI4PetzXXvhOdmb6QJmbAv5HIb7\nRyBYVooVnJoCGW/p5nkvh9UQXnMJFKD2WIYdQx7hCyiUQO1mmXbFKZ3jAoGAHPXH\nvCKFanyTohMvQXuO6UU39mB5HPtiX88UMHSF+aVQl9qLw4VSstsxEyHEifULHBO4\n9SGSSsWAN/LxaKyHSENcge8iniSYzCpKLVVfJZrve4wopXd2ActKNnvAj3S3wkPB\nbPHVaXSUV4mjBVoYdZWCqVJ18M92F94X2hDZi0kCgYARpi6PQL4F3bcIwGDwA5lh\nRaZ7tv9DZi6WvJRjy1Kd65oxyljPImcPaxt7I+HuVikub3a1uFoFM/Kk7NJbNHVy\nTaJX84JQSfpLGn9l7beimzGuho8obEJOZKWtK4SIdtgh9p62ji7I6NFKdsfA4myO\nKY9vH2DLSFlOVHibsKmFgg==\n-----END PRIVATE KEY-----\n',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return authClient;
  }
  
  // Function to delete a row in Google Sheets
  async function deleteRow(sheetId, rowIndex) {
    const authClient = await authenticate();
    
    const sheets = google.sheets({ version: 'v4', auth: authClient });
  
    const request = {
    //   spreadsheetId: '1Bjm39FwtIFSQKL5Xc-jBp5OpmQt3czMPYLbMWit6r5Q',
      spreadsheetId: '1_PMdmi3cd24bTEt3IVANPUvMxYQCQ8t-0zxNSOOF_JU',
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetId, // Sheet ID, not name
                dimension: 'ROWS',
                startIndex: rowIndex - 1, // Row index is 0-based
                endIndex: rowIndex, // This will delete a single row
              },
            },
          },
        ],
      },
    };
  
    try {
      await sheets.spreadsheets.batchUpdate(request);
      console.log('Row deleted successfully');
      return { status: true, message: 'Row deleted successfully' };
    } catch (error) {
      console.error('Error deleting row: ', error);
      return { status: false, error: error.message };
    }
  }
  
  // API route to delete a Google Sheet row
  router.delete('/delete-google-sheet-row', async (req, res) => {
  
    try {


        const serviceAccountAuth = new JWT({
            email: 'registrationgooglesheet@optical-wall-409909.iam.gserviceaccount.com',
            key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCNFZEHF0DuPXs+\nDcW3tnCO7K5R0AhBGFljvbyKn5QtNm6fgrTit4CSw49wtVDWxosjk8zSeBThc0Xw\nk4MneJe0o1xVKJ92Yl7CfGj9VbeBX/iuSGDsw7YO5H1s99dWnhlvZXx8BXpt/Hjm\nEpeFPhwZMvg7T+aQZDOlxyZhpvFK7NVF+L6kkGjCG+ZauEzmPzKKH6ULAw2IwPyd\ncwFcGAIcp69EJIE8gzaCRpOeSC2USd5oBkkAGs1xEy/qu1a2Px7bKtlTUj7nq546\nokzNFJqSYBZyxOr0g/OdCEQx5m1fnseBZEf1aDRENn7fRy/W10NRRFoxCIxKVe9g\n6H6albuLAgMBAAECggEAQP7egVXFI/xO+pd9rtTtpeqDpE0igFqnU7vlUDeUHAAn\nlnSwwIGpSfOt8U6Wn1t4XjuI8K1BcVuZrOtIULbNrPpVXyYH0JIg9Zg7BfqnP4Ln\nHeNaQ7kl9lZtMfY7zjunnBo07y3W6TSWvedyxn+GklVY5no4zexbntPQasxt/QXP\nQzQqk+EkvdHu/C1S3kVs45TD0gwjjBXfYAv1XnmwXcH2UGJsCjh+keNVdmFWKb1+\np2Milo86rbe656jH+BycPwgv+Ag0FX13CBh5/4uFg9vRlr1l5OiUaWETQlSusp+5\ncJ4LvR7X1034RIqJDdjPXBAT2Td/SBDs42GJIyTpAQKBgQDE+f4dtZVscxFe3cjB\nBepiTPVEDl2ofE/9/XHDdT7GAj3gNpt8Njfxcrp/Iyxah1RJX4norQ9Yo3mpzRBi\nOFktfQLjqv6sHINn35w5Ab9gAp/1TyAtBgPtu9h38TnjyKptQaj8jHLvgLqrENYJ\nn/mK9A0bdwNiL+BSw6eVpNzC4wKBgQC3XBgWNzDFgkQUDZYD+ixKZZRn+9UZ9MF7\nhbmzTJr5bbEiVNIsZVtW4Weo0O1SEys7/talBj4vO5qJPcoGhxWo9agJMQHvm6lC\nYfJjXJVa/aC+n+vb5OF8tKRc17zO/PzuzJ/JE6uyMXV0aZ57V0Y0uklsxiJCqZWW\nM5V1eBz9OQKBgAQ8H7OB0OmY+7mfaQ6FUwmz/93rtSXHLm0Wgtih76yQJcZpRiSA\ngell/w52siBsImrFbBCdj+Pm99mnt/90mK46rtI4PetzXXvhOdmb6QJmbAv5HIb7\nRyBYVooVnJoCGW/p5nkvh9UQXnMJFKD2WIYdQx7hCyiUQO1mmXbFKZ3jAoGAHPXH\nvCKFanyTohMvQXuO6UU39mB5HPtiX88UMHSF+aVQl9qLw4VSstsxEyHEifULHBO4\n9SGSSsWAN/LxaKyHSENcge8iniSYzCpKLVVfJZrve4wopXd2ActKNnvAj3S3wkPB\nbPHVaXSUV4mjBVoYdZWCqVJ18M92F94X2hDZi0kCgYARpi6PQL4F3bcIwGDwA5lh\nRaZ7tv9DZi6WvJRjy1Kd65oxyljPImcPaxt7I+HuVikub3a1uFoFM/Kk7NJbNHVy\nTaJX84JQSfpLGn9l7beimzGuho8obEJOZKWtK4SIdtgh9p62ji7I6NFKdsfA4myO\nKY9vH2DLSFlOVHibsKmFgg==\n-----END PRIVATE KEY-----\n',
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        // const doc = new GoogleSpreadsheet('1Bjm39FwtIFSQKL5Xc-jBp5OpmQt3czMPYLbMWit6r5Q', serviceAccountAuth);
        const doc = new GoogleSpreadsheet('1_PMdmi3cd24bTEt3IVANPUvMxYQCQ8t-0zxNSOOF_JU', serviceAccountAuth);

        await doc.loadInfo(); // loads document properties and worksheets

        let sheetIndex = parseInt(req.body.month) - 1;
        const sheet = doc.sheetsByIndex[sheetIndex];
const sheetId = sheet.sheetId;

        await sheet.loadCells(); // Load the sheet cells

        // Find the row with matching Enrollment_Id (RegistrationNo)
        let rowIndex = null;
        for (let i = 1; i <= sheet.rowCount; i++) {
            let enrollmentCell = sheet.getCellByA1(`A${i}`);
            if (enrollmentCell.value == req.body.RegistrationNo) {
                rowIndex = i;
                break;
            }
        }

        if (rowIndex === null) {
            return res.json({ "status": false, "message": "Enrollment_Id not found" });
        }

      const result = await deleteRow(sheetId, rowIndex);
      return res.json(result);
    } catch (error) {
      console.error('Error in /delete-google-sheet-row API:', error);
      return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
  });


module.exports = router;






