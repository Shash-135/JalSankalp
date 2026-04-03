import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app": {
        "title": "JalSankalp",
        "subtitle": "Gram Panchayat",
        "officialPortal": "Official Portal",
        "home": "Home",
        "grievance": "Grievance",
        "track": "Track",
        "tips": "Tips",
        "feedback": "Feedback"
      },
      "home": {
        "liveServices": "Live Services",
        "portalTitle": "Water Pump Support Portal",
        "portalDesc": "Scan the QR code on any public JalSankalp pump to file a grievance or view its status in real-time.",
        "scanTitle": "Scan Pump QR Code",
        "submitTitle": "Submit Grievance",
        "submitDesc": "Report a broken pump, leak, or supply issue",
        "trackTitle": "Track Request",
        "trackDesc": "Check the live status of your complaint",
        "tipsTitle": "Water Conservation Tips",
        "tipsDesc": "Official directives & schedules for residents"
      },
      "complaint": {
        "submitGrievance": "Submit Grievance",
        "fileComplaint": "File a Complaint",
        "providerDetails": "Provide your details and describe the pump issue to receive a tracking ID.",
        "fullName": "Full Name",
        "emailAddress": "Email Address",
        "getOtp": "Get OTP",
        "resend": "Resend",
        "otpSentTo": "OTP sent to",
        "otpVerification": "OTP Verification",
        "pumpId": "Pump ID",
        "areaLandmark": "Area / Landmark",
        "issueType": "Issue Type",
        "description": "Description",
        "photo": "Photo (Optional)",
        "submit": "Submit Complaint",
        "submitting": "Submitting...",
        "success": "Complaint Submitted!",
        "trackBtn": "Track This Complaint →"
      },
      "track": {
        "liveTracking": "Live Tracking",
        "trackGrievance": "Track Grievance",
        "enterDetails": "Enter your complaint ID and email to see the latest status.",
        "complaintId": "Complaint ID",
        "checkStatus": "Check Status",
        "searching": "Searching..."
      }
    }
  },
  hi: {
    translation: {
      "app": {
        "title": "जलसंकल्प",
        "subtitle": "ग्राम पंचायत",
        "officialPortal": "आधिकारिक पोर्टल",
        "home": "होम",
        "grievance": "शिकायत",
        "track": "ट्रैक",
        "tips": "सुझाव",
        "feedback": "प्रतिक्रिया"
      },
      "home": {
        "liveServices": "लाइव सेवाएँ",
        "portalTitle": "वाटर पंप सपोर्ट पोर्टल",
        "portalDesc": "शिकायत दर्ज करने या वास्तविक समय में स्थिति देखने के लिए किसी भी सार्वजनिक जलसंकल्प पंप पर क्यूआर कोड को स्कैन करें।",
        "scanTitle": "पंप क्यूआर कोड को स्कैन करें",
        "submitTitle": "शिकायत दर्ज करें",
        "submitDesc": "टूटे हुए पंप, रिसाव आदि की रिपोर्ट करें",
        "trackTitle": "अनुरोध ट्रैक करें",
        "trackDesc": "अपनी शिकायत की लाइव स्थिति की जाँच करें",
        "tipsTitle": "जल संरक्षण के उपाय",
        "tipsDesc": "निवासियों के लिए आधिकारिक दिशानिर्देश"
      },
      "complaint": {
        "submitGrievance": "शिकायत सबमिट करें",
        "fileComplaint": "शिकायत दर्ज करें",
        "providerDetails": "ट्रैकिंग आईडी प्राप्त करने के लिए पम्प की समस्या का विवरण दें।",
        "fullName": "पूरा नाम",
        "emailAddress": "ईमेल पता",
        "getOtp": "OTP प्राप्त करें",
        "resend": "पुनः भेजें",
        "otpSentTo": "OTP भेजा गया",
        "otpVerification": "OTP का सत्यापन",
        "pumpId": "पंप आईडी",
        "areaLandmark": "क्षेत्र / सीमाचिह्न",
        "issueType": "समस्या का प्रकार",
        "description": "विवरण",
        "photo": "फोटो (वैकल्पिक)",
        "submit": "शिकायत सबमिट करें",
        "submitting": "सबमिट हो रहा है...",
        "success": "शिकायत सबमिट की गई!",
        "trackBtn": "इस शिकायत को ट्रैक करें →"
      },
      "track": {
        "liveTracking": "लाइव ट्रैकिंग",
        "trackGrievance": "शिकायत ट्रैक करें",
        "enterDetails": "स्थिति देखने के लिए अपनी शिकायत आईडी और ईमेल दर्ज करें।",
        "complaintId": "शिकायत आईडी",
        "checkStatus": "स्थिति जांचें",
        "searching": "खोजा जा रहा है..."
      }
    }
  },
  mr: {
     translation: {
      "app": {
        "title": "जलसंकल्प",
        "subtitle": "ग्रामपंचायत",
        "officialPortal": "अधिकृत पोर्टल",
        "home": "होम",
        "grievance": "तक्रार",
        "track": "ट्रॅक",
        "tips": "टिपा",
        "feedback": "प्रतिक्रिया"
      },
      "home": {
        "liveServices": "थेट सेवा",
        "portalTitle": "वॉटर पंप सपोर्ट पोर्टल",
        "portalDesc": "तक्रार नोंदवण्यासाठी किंवा तिची स्थिती पाहण्यासाठी सार्वजनिक जलसंकल्प पंपवरील QR कोड स्कॅन करा.",
        "scanTitle": "पंप क्यूआर (QR) कोड स्कॅन करा",
        "submitTitle": "तक्रार नोंदवा",
        "submitDesc": "तुटलेला पंप किंवा गळतीची तक्रार करा",
        "trackTitle": "अनुरोध ट्रॅक करा",
        "trackDesc": "तुमच्या तक्रारीची थेट स्थिती तपासा",
        "tipsTitle": "पाणी बचतीच्या टिप्स",
        "tipsDesc": "रहिवाशांसाठी अधिकृत मार्गदर्शक तत्त्वे"
      },
      "complaint": {
        "submitGrievance": "तक्रार दाखल करा",
        "fileComplaint": "तक्रार नोंदवा",
        "providerDetails": "ट्रॅकिंग आयडी प्राप्त करण्यासाठी तपशील आणि पंपाच्या समस्येचे वर्णन द्या.",
        "fullName": "पूर्ण नाव",
        "emailAddress": "ईमेल पत्ता",
        "getOtp": "OTP मिळवा",
        "resend": "पुन्हा पाठवा",
        "otpSentTo": "OTP पाठवला",
        "otpVerification": "OTP पडताळणी",
        "pumpId": "पंप आयडी",
        "areaLandmark": "क्षेत्र / खूण",
        "issueType": "समस्येचा प्रकार",
        "description": "वर्णन",
        "photo": "फोटो (ऐच्छिक)",
        "submit": "तक्रार नोंदवा",
        "submitting": "सादर करत आहे...",
        "success": "तक्रार यशस्वीरित्या नोंदवली!",
        "trackBtn": "ही तक्रार ट्रॅक करा →"
      },
      "track": {
        "liveTracking": "थेट ट्रॅकिंग",
        "trackGrievance": "तक्रार ट्रॅक करा",
        "enterDetails": "स्थिती पाहण्यासाठी तुमची तक्रार आयडी आणि ईमेल प्रविष्ट करा.",
        "complaintId": "तक्रार आयडी",
        "checkStatus": "स्थिती तपासा",
        "searching": "शोधत आहे..."
      }
     }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
