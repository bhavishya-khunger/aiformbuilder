import mongoose from "mongoose";
import Form from "../models/form.model.js";
import Question from "../models/question.model.js";
import User from "../models/user.model.js";

export const run = async () => {
  try {
    const targetId = "694b00b6b0dc69116e23a14b";
    const targetEmail = "bhavishyakhunger@gmail.com";

    let user = await User.findById(targetId);
    
    if (!user) {
      user = await User.findOne({ email: targetEmail });
    }
    
    if (!user) {
      console.log("⚠️ User not found. Creating new user...");
      user = await User.create({ 
        fullname: "Bhavishya Khunger", 
        email: targetEmail,
        authProvider: "local",
        passwordHash: "$2b$10$EpOu..." 
      });
      console.log("👤 Created new user with ID:", user._id.toString());
    } else {
      console.log("👤 Using existing user:", user._id.toString());
    }

    // --- CREATE CUSTOMER FEEDBACK FORM (Uses multiple new types) ---
    const feedbackForm = await Form.create({
      ownerId: user._id,
      title: "Customer Experience Survey",
      description: "Help us improve your experience with our products and services",
      type: "form",
      status: "published",
      isPublic: true,
      settings: { 
        collectEmail: true, 
        shuffleQuestions: false, 
        allowMultipleAttempts: true 
      },
      category: "Feedback",
      tags: ["customer", "experience", "rating"]
    });
    console.log("📝 Created Customer Experience Survey:", feedbackForm._id.toString());

    const feedbackQuestions = [
      {
        formId: feedbackForm._id,
        type: "short_text",
        questionText: "What is your name?",
        description: "Optional, for personalized responses",
        order: 1,
        required: false
      },
      {
        formId: feedbackForm._id,
        type: "email",
        questionText: "What is your email address?",
        description: "We'll send a thank you note",
        order: 2,
        required: true
      },
      {
        formId: feedbackForm._id,
        type: "rating",
        questionText: "How would you rate our product overall?",
        ratingMax: 5,
        ratingLabels: { min: "Poor", max: "Excellent" },
        order: 3,
        required: true
      },
      {
        formId: feedbackForm._id,
        type: "linear_scale",
        questionText: "How satisfied are you with our customer service?",
        scaleRange: 7,
        scaleLabels: { min: "Very Dissatisfied", max: "Very Satisfied" },
        order: 4,
        required: true
      },
      {
        formId: feedbackForm._id,
        type: "yes_no",
        questionText: "Would you recommend us to friends or colleagues?",
        order: 5,
        required: true
      },
      {
        formId: feedbackForm._id,
        type: "dropdown",
        questionText: "Which product did you purchase?",
        options: [
          { label: "Premium Subscription", value: "premium" },
          { label: "Basic Plan", value: "basic" },
          { label: "Enterprise Package", value: "enterprise" },
          { label: "Trial Version", value: "trial" }
        ],
        order: 6,
        required: true
      },
      {
        formId: feedbackForm._id,
        type: "checkbox",
        questionText: "Which features do you use regularly? (Select all that apply)",
        options: [
          { label: "Dashboard Analytics", value: "analytics" },
          { label: "Team Collaboration", value: "collaboration" },
          { label: "Mobile App", value: "mobile" },
          { label: "API Access", value: "api" },
          { label: "Reporting Tools", value: "reports" },
          { label: "Custom Integrations", value: "integrations" }
        ],
        order: 7,
        required: false,
        allowMultiple: true
      },
      {
        formId: feedbackForm._id,
        type: "long_text",
        questionText: "What improvements would you suggest?",
        description: "Any specific features or changes you'd like to see",
        order: 8,
        required: false
      }
    ];

    await Question.insertMany(feedbackQuestions);
    console.log("✅ Added 8 questions to Customer Experience Survey");

    // --- CREATE JOB APPLICATION FORM (Comprehensive with all types) ---
    const jobForm = await Form.create({
      ownerId: user._id,
      title: "Software Developer Job Application",
      description: "Apply for our open software developer position. Please complete all fields accurately.",
      type: "form",
      status: "published",
      isPublic: true,
      settings: { 
        collectEmail: true, 
        shuffleQuestions: false, 
        allowMultipleAttempts: false 
      },
      category: "Recruitment",
      tags: ["job", "application", "career", "developer"]
    });
    console.log("📝 Created Job Application Form:", jobForm._id.toString());

    const jobQuestions = [
      {
        formId: jobForm._id,
        type: "short_text",
        questionText: "Full Legal Name",
        order: 1,
        required: true
      },
      {
        formId: jobForm._id,
        type: "email",
        questionText: "Email Address",
        description: "We'll contact you at this address",
        order: 2,
        required: true
      },
      {
        formId: jobForm._id,
        type: "phone",
        questionText: "Phone Number",
        description: "Best number to reach you",
        order: 3,
        required: true
      },
      {
        formId: jobForm._id,
        type: "url",
        questionText: "LinkedIn Profile URL",
        description: "Optional, but recommended",
        order: 4,
        required: false
      },
      {
        formId: jobForm._id,
        type: "url",
        questionText: "GitHub Profile URL",
        description: "If you have one",
        order: 5,
        required: false
      },
      {
        formId: jobForm._id,
        type: "date",
        questionText: "When are you available to start?",
        order: 6,
        required: true
      },
      {
        formId: jobForm._id,
        type: "number",
        questionText: "Years of Software Development Experience",
        description: "Enter number of years",
        order: 7,
        required: true
      },
      {
        formId: jobForm._id,
        type: "dropdown",
        questionText: "Highest Education Level",
        options: [
          { label: "High School Diploma", value: "high_school" },
          { label: "Associate Degree", value: "associate" },
          { label: "Bachelor's Degree", value: "bachelors" },
          { label: "Master's Degree", value: "masters" },
          { label: "PhD", value: "phd" },
          { label: "Other", value: "other" }
        ],
        order: 8,
        required: true
      },
      {
        formId: jobForm._id,
        type: "checkbox",
        questionText: "Which programming languages are you proficient in?",
        options: [
          { label: "JavaScript/TypeScript", value: "js" },
          { label: "Python", value: "python" },
          { label: "Java", value: "java" },
          { label: "C#", value: "csharp" },
          { label: "Go", value: "go" },
          { label: "Ruby", value: "ruby" },
          { label: "PHP", value: "php" },
          { label: "Swift", value: "swift" }
        ],
        order: 9,
        required: true,
        allowMultiple: true
      },
      {
        formId: jobForm._id,
        type: "checkbox",
        questionText: "Which technologies/frameworks are you experienced with?",
        options: [
          { label: "React", value: "react" },
          { label: "Node.js", value: "node" },
          { label: "Vue.js", value: "vue" },
          { label: "Angular", value: "angular" },
          { label: "Django", value: "django" },
          { label: "Spring Boot", value: "spring" },
          { label: ".NET Core", value: "dotnet" },
          { label: "Docker", value: "docker" },
          { label: "Kubernetes", value: "k8s" },
          { label: "AWS", value: "aws" }
        ],
        order: 10,
        required: false,
        allowMultiple: true
      },
      {
        formId: jobForm._id,
        type: "linear_scale",
        questionText: "Rate your expertise in frontend development",
        scaleRange: 5,
        scaleLabels: { min: "Beginner", max: "Expert" },
        order: 11,
        required: true
      },
      {
        formId: jobForm._id,
        type: "linear_scale",
        questionText: "Rate your expertise in backend development",
        scaleRange: 5,
        scaleLabels: { min: "Beginner", max: "Expert" },
        order: 12,
        required: true
      },
      {
        formId: jobForm._id,
        type: "file_upload",
        questionText: "Upload your Resume/CV",
        description: "PDF, DOC, or DOCX format only",
        acceptedFiles: ".pdf,.doc,.docx",
        order: 13,
        required: true
      },
      {
        formId: jobForm._id,
        type: "file_upload",
        questionText: "Portfolio or Work Samples (Optional)",
        description: "Any relevant project files or documentation",
        acceptedFiles: "*/*",
        order: 14,
        required: false
      },
      {
        formId: jobForm._id,
        type: "long_text",
        questionText: "Why are you interested in this position?",
        description: "Tell us what excites you about this role",
        order: 15,
        required: true
      },
      {
        formId: jobForm._id,
        type: "long_text",
        questionText: "Describe a challenging project you've worked on",
        description: "What was your role and what did you learn?",
        order: 16,
        required: true
      },
      {
        formId: jobForm._id,
        type: "short_text",
        questionText: "Current/Most Recent Job Title",
        order: 17,
        required: true
      },
      {
        formId: jobForm._id,
        type: "short_text",
        questionText: "Current/Most Recent Company",
        order: 18,
        required: true
      },
      {
        formId: jobForm._id,
        type: "multiple_choice_grid",
        questionText: "Rate your experience level with the following:",
        rows: [
          { label: "Database Design", value: "db_design" },
          { label: "API Development", value: "api_dev" },
          { label: "Testing/QA", value: "testing" },
          { label: "DevOps", value: "devops" },
          { label: "UI/UX Design", value: "ui_ux" },
          { label: "Agile/Scrum", value: "agile" }
        ],
        columns: [
          { label: "No Experience", value: "none" },
          { label: "Basic", value: "basic" },
          { label: "Intermediate", value: "intermediate" },
          { label: "Advanced", value: "advanced" },
          { label: "Expert", value: "expert" }
        ],
        order: 19,
        required: true
      },
      {
        formId: jobForm._id,
        type: "number",
        questionText: "Salary Expectation (Annual)",
        description: "Enter your expected annual salary in USD",
        order: 20,
        required: true
      },
      {
        formId: jobForm._id,
        type: "yes_no",
        questionText: "Are you authorized to work in the country where this position is located?",
        order: 21,
        required: true
      },
      {
        formId: jobForm._id,
        type: "yes_no",
        questionText: "Will you now or in the future require sponsorship for employment visa status?",
        order: 22,
        required: true
      },
      {
        formId: jobForm._id,
        type: "long_text",
        questionText: "Additional Comments or Questions",
        order: 23,
        required: false
      }
    ];

    await Question.insertMany(jobQuestions);
    console.log("✅ Added 23 comprehensive questions to Job Application Form");

    // --- CREATE EVENT PLANNING FORM (For conference/workshop) ---
    const eventForm = await Form.create({
      ownerId: user._id,
      title: "Annual Tech Summit 2024 Planning",
      description: "Help us plan the best tech summit ever! Share your preferences and requirements.",
      type: "form",
      status: "published",
      isPublic: true,
      settings: { 
        collectEmail: true, 
        shuffleQuestions: false, 
        allowMultipleAttempts: true 
      },
      category: "Events",
      tags: ["conference", "planning", "survey", "tech"]
    });
    console.log("📝 Created Event Planning Form:", eventForm._id.toString());

    const eventQuestions = [
      {
        formId: eventForm._id,
        type: "short_text",
        questionText: "Your Name",
        order: 1,
        required: true
      },
      {
        formId: eventForm._id,
        type: "email",
        questionText: "Work Email",
        description: "For official communications",
        order: 2,
        required: true
      },
      {
        formId: eventForm._id,
        type: "short_text",
        questionText: "Company/Organization",
        order: 3,
        required: true
      },
      {
        formId: eventForm._id,
        type: "short_text",
        questionText: "Job Title/Role",
        order: 4,
        required: true
      },
      {
        formId: eventForm._id,
        type: "date",
        questionText: "Preferred Event Dates",
        description: "Select your preferred date range",
        order: 5,
        required: false
      },
      {
        formId: eventForm._id,
        type: "time",
        questionText: "Preferred Start Time Each Day",
        order: 6,
        required: false
      },
      {
        formId: eventForm._id,
        type: "checkbox",
        questionText: "Which days would you attend?",
        options: [
          { label: "Monday", value: "monday" },
          { label: "Tuesday", value: "tuesday" },
          { label: "Wednesday", value: "wednesday" },
          { label: "Thursday", value: "thursday" },
          { label: "Friday", value: "friday" }
        ],
        order: 7,
        required: true,
        allowMultiple: true
      },
      {
        formId: eventForm._id,
        type: "linear_scale",
        questionText: "How important are networking opportunities?",
        scaleRange: 5,
        scaleLabels: { min: "Not Important", max: "Very Important" },
        order: 8,
        required: true
      },
      {
        formId: eventForm._id,
        type: "linear_scale",
        questionText: "How important are hands-on workshops?",
        scaleRange: 5,
        scaleLabels: { min: "Not Important", max: "Very Important" },
        order: 9,
        required: true
      },
      {
        formId: eventForm._id,
        type: "rating",
        questionText: "Rate the importance of keynote speakers",
        ratingMax: 5,
        ratingLabels: { min: "Low Priority", max: "High Priority" },
        order: 10,
        required: true
      },
      {
        formId: eventForm._id,
        type: "rating",
        questionText: "Rate the importance of venue location",
        ratingMax: 5,
        ratingLabels: { min: "Low Priority", max: "High Priority" },
        order: 11,
        required: true
      },
      {
        formId: eventForm._id,
        type: "dropdown",
        questionText: "What's your preferred venue type?",
        options: [
          { label: "Conference Center", value: "conference_center" },
          { label: "Hotel Ballroom", value: "hotel" },
          { label: "University Campus", value: "university" },
          { label: "Co-working Space", value: "coworking" },
          { label: "Virtual/Online", value: "virtual" },
          { label: "Hybrid", value: "hybrid" }
        ],
        order: 12,
        required: true
      },
      {
        formId: eventForm._id,
        type: "number",
        questionText: "How many people from your organization might attend?",
        description: "Estimated number of attendees",
        order: 13,
        required: true
      },
      {
        formId: eventForm._id,
        type: "checkbox",
        questionText: "Which topics interest you most?",
        options: [
          { label: "AI & Machine Learning", value: "ai" },
          { label: "Cloud Computing", value: "cloud" },
          { label: "Cybersecurity", value: "security" },
          { label: "Web Development", value: "web" },
          { label: "Mobile Development", value: "mobile" },
          { label: "DevOps", value: "devops" },
          { label: "Data Science", value: "data" },
          { label: "UI/UX Design", value: "design" },
          { label: "Blockchain", value: "blockchain" },
          { label: "Quantum Computing", value: "quantum" }
        ],
        order: 14,
        required: true,
        allowMultiple: true
      },
      {
        formId: eventForm._id,
        type: "dropdown",
        questionText: "What's your budget per attendee?",
        options: [
          { label: "$0 - $199", value: "0-199" },
          { label: "$200 - $499", value: "200-499" },
          { label: "$500 - $999", value: "500-999" },
          { label: "$1000 - $1999", value: "1000-1999" },
          { label: "$2000+", value: "2000+" }
        ],
        order: 15,
        required: true
      },
      {
        formId: eventForm._id,
        type: "yes_no",
        questionText: "Would you like exhibition/sponsorship information?",
        order: 16,
        required: true
      },
      {
        formId: eventForm._id,
        type: "yes_no",
        questionText: "Are you interested in speaking opportunities?",
        order: 17,
        required: true
      },
      {
        formId: eventForm._id,
        type: "file_upload",
        questionText: "Upload sponsorship/partnership proposal (Optional)",
        description: "If you're interested in sponsoring",
        acceptedFiles: ".pdf,.doc,.docx,.ppt,.pptx",
        order: 18,
        required: false
      },
      {
        formId: eventForm._id,
        type: "multiple_choice_grid",
        questionText: "Rate the importance of these event aspects:",
        rows: [
          { label: "Networking Sessions", value: "networking" },
          { label: "Technical Workshops", value: "workshops" },
          { label: "Keynote Presentations", value: "keynotes" },
          { label: "Exhibition Area", value: "exhibition" },
          { label: "Food & Beverages", value: "food" },
          { label: "Swag/Goodies", value: "swag" },
          { label: "After-party/Social Events", value: "social" }
        ],
        columns: [
          { label: "Not Important", value: "not_important" },
          { label: "Somewhat Important", value: "somewhat" },
          { label: "Important", value: "important" },
          { label: "Very Important", value: "very_important" },
          { label: "Critical", value: "critical" }
        ],
        order: 19,
        required: true
      },
      {
        formId: eventForm._id,
        type: "long_text",
        questionText: "Any specific speakers or topics you'd like to see?",
        order: 20,
        required: false
      },
      {
        formId: eventForm._id,
        type: "long_text",
        questionText: "Any dietary restrictions or special requirements?",
        description: "For catering and accessibility planning",
        order: 21,
        required: false
      }
    ];

    await Question.insertMany(eventQuestions);
    console.log("✅ Added 21 questions to Event Planning Form");

    // --- CREATE HEALTH & FITNESS ASSESSMENT FORM ---
    const healthForm = await Form.create({
      ownerId: user._id,
      title: "Health & Fitness Assessment",
      description: "Complete this assessment to get personalized fitness recommendations",
      type: "form",
      status: "published",
      isPublic: true,
      settings: { 
        collectEmail: true, 
        shuffleQuestions: false, 
        allowMultipleAttempts: false 
      },
      category: "Health",
      tags: ["fitness", "wellness", "assessment", "health"]
    });
    console.log("📝 Created Health & Fitness Assessment:", healthForm._id.toString());

    const healthQuestions = [
      {
        formId: healthForm._id,
        type: "short_text",
        questionText: "Full Name",
        order: 1,
        required: true
      },
      {
        formId: healthForm._id,
        type: "email",
        questionText: "Email Address",
        description: "We'll send your personalized plan here",
        order: 2,
        required: true
      },
      {
        formId: healthForm._id,
        type: "date",
        questionText: "Date of Birth",
        order: 3,
        required: true
      },
      {
        formId: healthForm._id,
        type: "phone",
        questionText: "Emergency Contact Number",
        description: "In case of emergency during workouts",
        order: 4,
        required: true
      },
      {
        formId: healthForm._id,
        type: "number",
        questionText: "Height (in cm)",
        order: 5,
        required: true
      },
      {
        formId: healthForm._id,
        type: "number",
        questionText: "Weight (in kg)",
        order: 6,
        required: true
      },
      {
        formId: healthForm._id,
        type: "dropdown",
        questionText: "Gender",
        options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
          { label: "Non-binary", value: "non_binary" },
          { label: "Prefer not to say", value: "not_say" }
        ],
        order: 7,
        required: true
      },
      {
        formId: healthForm._id,
        type: "linear_scale",
        questionText: "How would you rate your current fitness level?",
        scaleRange: 10,
        scaleLabels: { min: "Beginner", max: "Athlete" },
        order: 8,
        required: true
      },
      {
        formId: healthForm._id,
        type: "rating",
        questionText: "How important is weight loss to you?",
        ratingMax: 5,
        ratingLabels: { min: "Not Important", max: "Very Important" },
        order: 9,
        required: true
      },
      {
        formId: healthForm._id,
        type: "rating",
        questionText: "How important is muscle building to you?",
        ratingMax: 5,
        ratingLabels: { min: "Not Important", max: "Very Important" },
        order: 10,
        required: true
      },
      {
        formId: healthForm._id,
        type: "checkbox",
        questionText: "Which fitness activities do you enjoy? (Select all that apply)",
        options: [
          { label: "Running/Jogging", value: "running" },
          { label: "Weight Training", value: "weights" },
          { label: "Yoga", value: "yoga" },
          { label: "Cycling", value: "cycling" },
          { label: "Swimming", value: "swimming" },
          { label: "HIIT", value: "hiit" },
          { label: "Dance", value: "dance" },
          { label: "Team Sports", value: "sports" },
          { label: "Walking", value: "walking" },
          { label: "Pilates", value: "pilates" }
        ],
        order: 11,
        required: true,
        allowMultiple: true
      },
      {
        formId: healthForm._id,
        type: "number",
        questionText: "How many days per week can you commit to exercise?",
        description: "Enter 0-7",
        order: 12,
        required: true
      },
      {
        formId: healthForm._id,
        type: "number",
        questionText: "How many minutes per session?",
        description: "Typical workout duration",
        order: 13,
        required: true
      },
      {
        formId: healthForm._id,
        type: "time",
        questionText: "Preferred workout time of day",
        order: 14,
        required: false
      },
      {
        formId: healthForm._id,
        type: "dropdown",
        questionText: "Where do you prefer to exercise?",
        options: [
          { label: "Gym", value: "gym" },
          { label: "Home", value: "home" },
          { label: "Outdoors", value: "outdoors" },
          { label: "Studio/Class", value: "studio" },
          { label: "Anywhere", value: "anywhere" }
        ],
        order: 15,
        required: true
      },
      {
        formId: healthForm._id,
        type: "multiple_choice_grid",
        questionText: "Rate your experience with these exercise types:",
        rows: [
          { label: "Cardio", value: "cardio" },
          { label: "Strength Training", value: "strength" },
          { label: "Flexibility", value: "flexibility" },
          { label: "Balance", value: "balance" },
          { label: "Endurance", value: "endurance" }
        ],
        columns: [
          { label: "Never Tried", value: "never" },
          { label: "Beginner", value: "beginner" },
          { label: "Intermediate", value: "intermediate" },
          { label: "Advanced", value: "advanced" }
        ],
        order: 16,
        required: true
      },
      {
        formId: healthForm._id,
        type: "yes_no",
        questionText: "Do you have any medical conditions we should know about?",
        description: "Heart conditions, injuries, etc.",
        order: 17,
        required: true
      },
      {
        formId: healthForm._id,
        type: "yes_no",
        questionText: "Are you currently under a doctor's care?",
        order: 18,
        required: true
      },
      {
        formId: healthForm._id,
        type: "yes_no",
        questionText: "Are you currently taking any medications?",
        order: 19,
        required: true
      },
      {
        formId: healthForm._id,
        type: "long_text",
        questionText: "Please describe any injuries or limitations",
        description: "Past or present",
        order: 20,
        required: false
      },
      {
        formId: healthForm._id,
        type: "long_text",
        questionText: "What are your main fitness goals?",
        description: "Be as specific as possible",
        order: 21,
        required: true
      },
      {
        formId: healthForm._id,
        type: "long_text",
        questionText: "Any other information you'd like to share?",
        order: 22,
        required: false
      },
      {
        formId: healthForm._id,
        type: "file_upload",
        questionText: "Upload recent medical clearance (Optional)",
        description: "If you have one from your doctor",
        acceptedFiles: ".pdf,.jpg,.png",
        order: 23,
        required: false
      }
    ];

    await Question.insertMany(healthQuestions);
    console.log("✅ Added 23 questions to Health & Fitness Assessment");

    // --- CREATE PRODUCT FEEDBACK QUIZ (Interactive quiz format) ---
    const productQuiz = await Form.create({
      ownerId: user._id,
      title: "Product Knowledge Quiz",
      description: "Test your knowledge about our products and services",
      type: "quiz",
      status: "published",
      isPublic: true,
      settings: { 
        collectEmail: false, 
        shuffleQuestions: true, 
        allowMultipleAttempts: true 
      },
      category: "Education",
      tags: ["quiz", "product", "knowledge", "test"]
    });
    console.log("📝 Created Product Knowledge Quiz:", productQuiz._id.toString());

    const productQuizQuestions = [
      {
        formId: productQuiz._id,
        type: "mcq",
        questionText: "Which year was our company founded?",
        options: [
          { label: "2015", value: "2015" },
          { label: "2017", value: "2017" },
          { label: "2019", value: "2019" },
          { label: "2021", value: "2021" }
        ],
        correctAnswer: "2019",
        order: 1,
        required: true
      },
      {
        formId: productQuiz._id,
        type: "mcq",
        questionText: "What is our flagship product?",
        options: [
          { label: "Formify Pro", value: "formify_pro" },
          { label: "SurveyMaster", value: "surveymaster" },
          { label: "DataCollect", value: "datacollect" },
          { label: "ResponseHub", value: "responsehub" }
        ],
        correctAnswer: "Formify Pro",
        order: 2,
        required: true
      },
      {
        formId: productQuiz._id,
        type: "checkbox",
        questionText: "Which platforms do we support? (Select all correct answers)",
        options: [
          { label: "Web", value: "web" },
          { label: "iOS", value: "ios" },
          { label: "Android", value: "android" },
          { label: "Windows Desktop", value: "windows" },
          { label: "Linux", value: "linux" },
          { label: "macOS", value: "macos" }
        ],
        correctAnswers: ["web", "ios", "android"],
        order: 3,
        required: true,
        allowMultiple: true
      },
      {
        formId: productQuiz._id,
        type: "dropdown",
        questionText: "What is our primary pricing model?",
        options: [
          { label: "One-time purchase", value: "one_time" },
          { label: "Monthly subscription", value: "monthly" },
          { label: "Annual subscription", value: "annual" },
          { label: "Pay-per-use", value: "pay_per_use" }
        ],
        correctAnswer: "annual",
        order: 4,
        required: true
      },
      {
        formId: productQuiz._id,
        type: "short_text",
        questionText: "What is the maximum file size for uploads in our premium plan?",
        correctAnswer: "100MB",
        order: 5,
        required: true
      },
      {
        formId: productQuiz._id,
        type: "number",
        questionText: "How many team members can be added in the Enterprise plan?",
        correctAnswer: "50",
        order: 6,
        required: true
      },
      {
        formId: productQuiz._id,
        type: "yes_no",
        questionText: "Do we offer API access in the Basic plan?",
        correctAnswer: "no",
        order: 7,
        required: true
      },
      {
        formId: productQuiz._id,
        type: "multiple_choice_grid",
        questionText: "Match the feature with the correct plan:",
        rows: [
          { label: "Unlimited Forms", value: "unlimited_forms" },
          { label: "Advanced Analytics", value: "analytics" },
          { label: "API Access", value: "api" },
          { label: "Custom Branding", value: "branding" },
          { label: "Priority Support", value: "support" }
        ],
        columns: [
          { label: "Basic", value: "basic" },
          { label: "Pro", value: "pro" },
          { label: "Enterprise", value: "enterprise" }
        ],
        correctAnswers: {
          "unlimited_forms": "pro",
          "analytics": "pro",
          "api": "enterprise",
          "branding": "enterprise",
          "support": "enterprise"
        },
        order: 8,
        required: true
      },
      {
        formId: productQuiz._id,
        type: "linear_scale",
        questionText: "Rate the difficulty of this quiz (1=Easy, 10=Hard)",
        scaleRange: 10,
        scaleLabels: { min: "Very Easy", max: "Very Hard" },
        order: 9,
        required: true
      },
      {
        formId: productQuiz._id,
        type: "rating",
        questionText: "How useful was this quiz for learning about our products?",
        ratingMax: 5,
        ratingLabels: { min: "Not Useful", max: "Very Useful" },
        order: 10,
        required: true
      },
      {
        formId: productQuiz._id,
        type: "long_text",
        questionText: "What topics would you like to see in future quizzes?",
        order: 11,
        required: false
      }
    ];

    await Question.insertMany(productQuizQuestions);
    console.log("✅ Added 11 questions to Product Knowledge Quiz");

    console.log("🎉 Seed completed successfully!");
    console.log("📊 Created 5 comprehensive forms utilizing all question types:");
    console.log("  1. Customer Experience Survey (8 questions) - Rating, Linear Scale, Yes/No, Dropdown, Checkbox");
    console.log("  2. Job Application Form (23 questions) - Email, Phone, URL, Date, Number, File Upload, Multiple Choice Grid");
    console.log("  3. Event Planning Form (21 questions) - Time, Checkbox, Linear Scale, Rating, Dropdown, Multiple Choice Grid");
    console.log("  4. Health & Fitness Assessment (23 questions) - Date, Number, Phone, Linear Scale, Rating, Multiple Choice Grid");
    console.log("  5. Product Knowledge Quiz (11 questions) - MCQ, Checkbox, Dropdown, Short Text, Number, Yes/No, Multiple Choice Grid");

    console.log("\n🎯 Question Types Demonstrated:");
    console.log("  • Basic: short_text, long_text, email, phone, url, number, date, time");
    console.log("  • Selection: mcq, checkbox, dropdown, yes_no");
    console.log("  • Rating: rating (stars), linear_scale (1-5/1-10)");
    console.log("  • Advanced: multiple_choice_grid (matrix), file_upload");
    console.log("  • Quiz: correctAnswer, correctAnswers (for scoring)");

  } catch (err) {
    console.error("❌ Error:", err);
  }
};

export const createMathQuiz = async () => {
    console.log("⚠️ This function is deprecated. Use the main run() function for comprehensive forms.");
    console.log("📚 The new seed includes 5 forms with all question types.");
};