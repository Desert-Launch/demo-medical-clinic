import { addDays, addMinutes, format, startOfDay, subDays } from "date-fns";

import {
  candidateStarts,
  intervalsOverlap,
  shiftForDay,
  slotFitsShift,
} from "@/lib/scheduling";
import { createId, createReference } from "@/lib/store/ids";
import { site } from "@/lib/site";
import type {
  Appointment,
  AppointmentStatus,
  BookingChannel,
  Doctor,
  Patient,
  PatientGender,
  Shift,
  Specialty,
} from "@/types";

/**
 * Specialties and doctors keep readable, stable ids — they appear in URLs
 * (`/specialties/cardiology`, `/book?specialty=…`) and are never created at
 * runtime. Patients and appointments are user-created, so those get generated
 * ids.
 */

/** Same shift on several weekdays. 0 is Sunday, matching `Date.getDay()`. */
function shifts(days: number[], startHour: number, endHour: number): Shift[] {
  return days.map((day) => ({ day, startHour, endHour }));
}

/* -------------------------------------------------------------------------- */
/* Specialties                                                                 */
/* -------------------------------------------------------------------------- */

export const seedSpecialties: Specialty[] = [
  {
    id: "spc_family",
    slug: "family-medicine",
    name: "Family medicine",
    nameArabic: "طب الأسرة",
    icon: "stethoscope",
    summary:
      "Your first stop for anything that is not obviously one department’s problem.",
    description:
      "Family medicine is where most visits to Andalus begin. Our GPs handle everyday illness, long-term conditions like diabetes and hypertension, health screening, and the referrals that send you to the right specialist upstairs rather than across town.",
    treats: [
      "Coughs, fevers and infections",
      "Diabetes and blood pressure reviews",
      "Annual health screening",
      "Travel vaccinations and fit-to-work letters",
      "Referrals to our specialist departments",
    ],
    consultationFeeAED: 250,
    art: 1,
    services: [
      {
        id: "srv_family_consult",
        name: "General consultation",
        summary: "A 20-minute appointment with a family doctor.",
        durationMinutes: 20,
        priceAED: 250,
      },
      {
        id: "srv_family_checkup",
        name: "Annual health check",
        summary: "Bloods, ECG, vitals and a written summary in one visit.",
        durationMinutes: 60,
        priceAED: 850,
      },
      {
        id: "srv_family_chronic",
        name: "Chronic condition review",
        summary: "Follow-up for diabetes, blood pressure or cholesterol.",
        durationMinutes: 30,
        priceAED: 220,
      },
      {
        id: "srv_family_vaccine",
        name: "Vaccination and travel clinic",
        summary: "Routine and travel vaccines, with a certificate.",
        durationMinutes: 20,
        priceAED: 180,
        priceNote: "plus vaccine cost",
      },
    ],
  },
  {
    id: "spc_derm",
    slug: "dermatology",
    name: "Dermatology",
    nameArabic: "الأمراض الجلدية",
    icon: "scan-face",
    summary: "Skin, hair and nails — from stubborn acne to mole checks.",
    description:
      "Our dermatologists see medical and cosmetic skin conditions in the same clinic, which means a mole check and an acne plan can happen in one sitting. Dermoscopy and patch testing are done on site.",
    treats: [
      "Acne, rosacea and eczema",
      "Mole and skin lesion checks",
      "Hair loss and scalp conditions",
      "Pigmentation and melasma",
      "Allergy patch testing",
    ],
    consultationFeeAED: 350,
    art: 2,
    services: [
      {
        id: "srv_derm_consult",
        name: "Skin consultation",
        summary: "Diagnosis and a treatment plan, with prescriptions if needed.",
        durationMinutes: 20,
        priceAED: 350,
      },
      {
        id: "srv_derm_acne",
        name: "Acne treatment plan",
        summary: "A staged plan with review dates, not a one-off cream.",
        durationMinutes: 30,
        priceAED: 450,
      },
      {
        id: "srv_derm_mole",
        name: "Mole and lesion check",
        summary: "Full-body dermoscopy with photographs kept on file.",
        durationMinutes: 30,
        priceAED: 480,
      },
      {
        id: "srv_derm_laser",
        name: "Laser treatment session",
        summary: "Pigmentation and vascular lesions, done in clinic.",
        durationMinutes: 45,
        priceAED: 900,
        priceNote: "per session",
      },
    ],
  },
  {
    id: "spc_paeds",
    slug: "paediatrics",
    name: "Paediatrics",
    nameArabic: "طب الأطفال",
    icon: "baby",
    summary: "Newborn to sixteen, with a waiting room built for it.",
    description:
      "Children are seen in a separate wing with its own entrance, so a two-year-old with a fever is not sitting beside a cardiology clinic. Same-day slots are held back every morning for sick children.",
    treats: [
      "Fever, coughs and stomach bugs",
      "Newborn and six-week checks",
      "Childhood vaccination schedule",
      "Growth, feeding and sleep",
      "Asthma and childhood allergy",
    ],
    consultationFeeAED: 300,
    art: 3,
    services: [
      {
        id: "srv_paeds_consult",
        name: "Child consultation",
        summary: "For anything acute — fevers, rashes, tummy aches.",
        durationMinutes: 20,
        priceAED: 300,
      },
      {
        id: "srv_paeds_newborn",
        name: "Newborn check",
        summary: "A head-to-toe check in the first weeks, with feeding advice.",
        durationMinutes: 30,
        priceAED: 420,
      },
      {
        id: "srv_paeds_vaccine",
        name: "Childhood vaccination",
        summary: "On the UAE national schedule, recorded in your child’s book.",
        durationMinutes: 20,
        priceAED: 220,
      },
      {
        id: "srv_paeds_growth",
        name: "Growth and development review",
        summary: "Milestones, weight and height plotted against the curve.",
        durationMinutes: 30,
        priceAED: 380,
      },
    ],
  },
  {
    id: "spc_cardio",
    slug: "cardiology",
    name: "Cardiology",
    nameArabic: "أمراض القلب",
    icon: "heart-pulse",
    summary: "Chest pain, palpitations and blood pressure that will not settle.",
    description:
      "ECG, echocardiography and treadmill testing run in the department, so most patients leave the same visit knowing what is going on. Results are read by the consultant who saw you, not posted on later.",
    treats: [
      "Chest pain and breathlessness",
      "Palpitations and irregular heartbeat",
      "High blood pressure and cholesterol",
      "Pre-operative cardiac clearance",
      "Heart failure follow-up",
    ],
    consultationFeeAED: 500,
    art: 4,
    services: [
      {
        id: "srv_cardio_consult",
        name: "Cardiology consultation",
        summary: "History, examination and an ECG in the same appointment.",
        durationMinutes: 30,
        priceAED: 500,
      },
      {
        id: "srv_cardio_ecg",
        name: "ECG with consultant review",
        summary: "A twelve-lead trace, read and explained before you leave.",
        durationMinutes: 30,
        priceAED: 450,
      },
      {
        id: "srv_cardio_echo",
        name: "Echocardiogram",
        summary: "Ultrasound of the heart valves and pumping function.",
        durationMinutes: 45,
        priceAED: 1200,
      },
      {
        id: "srv_cardio_stress",
        name: "Treadmill stress test",
        summary: "Exercise ECG for chest pain on exertion.",
        durationMinutes: 60,
        priceAED: 1400,
      },
    ],
  },
  {
    id: "spc_ent",
    slug: "ent",
    name: "ENT",
    nameArabic: "الأنف والأذن والحنجرة",
    icon: "ear",
    summary: "Ears, nose, throat, sinuses and the sleep problems behind them.",
    description:
      "Nasal endoscopy and audiology are in the same corridor, so a blocked nose or a hearing complaint is usually settled in one visit. Children with recurrent ear infections are seen jointly with paediatrics.",
    treats: [
      "Blocked nose and sinusitis",
      "Hearing loss and tinnitus",
      "Sore throat and tonsil problems",
      "Snoring and sleep apnoea",
      "Vertigo and balance",
    ],
    consultationFeeAED: 350,
    art: 5,
    services: [
      {
        id: "srv_ent_consult",
        name: "ENT consultation",
        summary: "Examination of ears, nose and throat with a plan.",
        durationMinutes: 20,
        priceAED: 350,
      },
      {
        id: "srv_ent_hearing",
        name: "Hearing test",
        summary: "Full audiogram in a sound booth, results the same day.",
        durationMinutes: 30,
        priceAED: 400,
      },
      {
        id: "srv_ent_endoscopy",
        name: "Nasal endoscopy",
        summary: "A camera look at the nose and sinuses, under local spray.",
        durationMinutes: 30,
        priceAED: 650,
      },
      {
        id: "srv_ent_wax",
        name: "Ear wax removal",
        summary: "Microsuction — quick, dry and no syringing.",
        durationMinutes: 20,
        priceAED: 300,
      },
    ],
  },
  {
    id: "spc_physio",
    slug: "physiotherapy",
    name: "Physiotherapy",
    nameArabic: "العلاج الطبيعي",
    icon: "activity",
    summary: "Hands-on rehab for backs, shoulders, knees and post-surgery.",
    description:
      "Every course starts with a 45-minute assessment and a written plan you keep. Sessions are one-to-one in a private room — no shared gym floor, no assistant running the exercises.",
    treats: [
      "Back and neck pain",
      "Shoulder, knee and ankle injuries",
      "Post-surgical rehabilitation",
      "Sports injuries and return-to-play",
      "Posture and desk-related strain",
    ],
    consultationFeeAED: 380,
    art: 6,
    services: [
      {
        id: "srv_physio_assess",
        name: "Physiotherapy assessment",
        summary: "45 minutes of testing, then a written programme.",
        durationMinutes: 45,
        priceAED: 380,
      },
      {
        id: "srv_physio_session",
        name: "Treatment session",
        summary: "One-to-one manual therapy and supervised exercise.",
        durationMinutes: 45,
        priceAED: 280,
        priceNote: "per session",
      },
      {
        id: "srv_physio_sports",
        name: "Sports injury rehabilitation",
        summary: "Loaded rehab with return-to-sport testing.",
        durationMinutes: 60,
        priceAED: 420,
      },
      {
        id: "srv_physio_post_op",
        name: "Post-surgical rehabilitation",
        summary: "Protocol-led recovery, coordinated with your surgeon.",
        durationMinutes: 45,
        priceAED: 350,
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Doctors                                                                     */
/* -------------------------------------------------------------------------- */

export const seedDoctors: Doctor[] = [
  {
    id: "doc_almansoori",
    name: "Dr. Layla Al Mansoori",
    nameArabic: "د. ليلى المنصوري",
    title: "Consultant",
    credentials: "MBBS, MRCGP (UK), Arab Board Family Medicine",
    specialtyId: "spc_family",
    focus: "Women’s health and chronic disease",
    bio: "Layla has run family medicine clinics in Abu Dhabi for fourteen years and set up the diabetes review programme at Andalus. She sees a lot of patients who have been passed between departments and want one person holding the thread.",
    languages: ["Arabic", "English", "French"],
    yearsExperience: 14,
    consultationFeeAED: 250,
    shifts: shifts([0, 1, 2, 3, 4], 8, 16),
    portrait: 1,
  },
  {
    id: "doc_menon",
    name: "Dr. Rajesh Menon",
    nameArabic: "د. راجيش مينون",
    title: "Specialist",
    credentials: "MBBS, MD Family Medicine",
    specialtyId: "spc_family",
    focus: "Preventive health and screening",
    bio: "Rajesh runs the annual health check clinic and the travel vaccination service. He is the doctor most likely to talk you out of a test you do not need, and into the one you have been avoiding.",
    languages: ["English", "Hindi", "Malayalam"],
    yearsExperience: 9,
    consultationFeeAED: 250,
    shifts: [...shifts([0, 1, 2, 3], 13, 21), ...shifts([6], 9, 15)],
    portrait: 2,
  },
  {
    id: "doc_haddad_f",
    name: "Dr. Farah Haddad",
    nameArabic: "د. فرح حداد",
    title: "Specialist",
    credentials: "MBBS, MRCGP (UK)",
    specialtyId: "spc_family",
    focus: "Acute illness and same-day care",
    bio: "Farah covers the walk-in and same-day list, which means most of her day is fevers, chest infections and injuries that are not quite an emergency. She keeps late slots open on weekday evenings.",
    languages: ["Arabic", "English"],
    yearsExperience: 7,
    consultationFeeAED: 250,
    shifts: [...shifts([1, 2, 3, 4], 12, 20), ...shifts([5], 8, 12)],
    portrait: 3,
  },
  {
    id: "doc_kassem",
    name: "Dr. Hana Kassem",
    nameArabic: "د. هناء قاسم",
    title: "Consultant",
    credentials: "MBBCh, MSc Dermatology (Cardiff), Arab Board Dermatology",
    specialtyId: "spc_derm",
    focus: "Medical dermatology and skin cancer screening",
    bio: "Hana built the dermoscopy service at Andalus and photographs every lesion she checks, so next year’s appointment starts from evidence rather than memory.",
    languages: ["Arabic", "English"],
    yearsExperience: 16,
    consultationFeeAED: 350,
    shifts: shifts([0, 1, 2, 3], 9, 17),
    portrait: 4,
  },
  {
    id: "doc_duarte",
    name: "Dr. Sofia Duarte",
    nameArabic: "د. صوفيا دوارتي",
    title: "Specialist",
    credentials: "MD, European Board Dermatology",
    specialtyId: "spc_derm",
    focus: "Acne, pigmentation and laser",
    bio: "Sofia treats a lot of adult acne and melasma, and is candid about how long each takes to shift. She runs the laser list on Tuesdays and Thursdays.",
    languages: ["English", "French"],
    yearsExperience: 8,
    consultationFeeAED: 350,
    shifts: [...shifts([2, 3, 4], 11, 19), ...shifts([6], 10, 16)],
    portrait: 5,
  },
  {
    id: "doc_alhosani",
    name: "Dr. Noura Al Hosani",
    nameArabic: "د. نورة الحوسني",
    title: "Consultant",
    credentials: "MBBS, Arab Board Paediatrics, MRCPCH (UK)",
    specialtyId: "spc_paeds",
    focus: "General paediatrics and newborn care",
    bio: "Noura leads the paediatric wing and holds back morning slots every day for sick children. She has looked after some families here since their first child’s six-week check.",
    languages: ["Arabic", "English"],
    yearsExperience: 12,
    consultationFeeAED: 300,
    shifts: shifts([0, 1, 2, 3, 4], 8, 15),
    portrait: 6,
  },
  {
    id: "doc_reyes",
    name: "Dr. Marco Reyes",
    nameArabic: "د. ماركو رييس",
    title: "Specialist",
    credentials: "MD, Diplomate in Paediatrics",
    specialtyId: "spc_paeds",
    focus: "Childhood asthma and allergy",
    bio: "Marco runs the childhood asthma clinic and the allergy testing list. Parents tend to book him for the second opinion and stay for the follow-ups.",
    languages: ["English", "Tagalog"],
    yearsExperience: 7,
    consultationFeeAED: 300,
    shifts: [...shifts([1, 2, 3, 4], 14, 21), ...shifts([6], 9, 15)],
    portrait: 1,
  },
  {
    id: "doc_alshamsi",
    name: "Dr. Omar Al Shamsi",
    nameArabic: "د. عمر الشامسي",
    title: "Consultant",
    credentials: "MBBS, FRCP (Edin), Fellowship in Interventional Cardiology",
    specialtyId: "spc_cardio",
    focus: "Interventional cardiology and chest pain",
    bio: "Omar spent nine years in a tertiary cardiac centre before moving to outpatient work. He reads his own echoes and stress tests, and will tell you on the day whether something needs a hospital.",
    languages: ["Arabic", "English"],
    yearsExperience: 19,
    consultationFeeAED: 500,
    shifts: shifts([0, 1, 2, 3], 9, 16),
    portrait: 2,
  },
  {
    id: "doc_anand",
    name: "Dr. Priya Anand",
    nameArabic: "د. بريا أناند",
    title: "Specialist",
    credentials: "MBBS, MD Cardiology, FACC",
    specialtyId: "spc_cardio",
    focus: "Preventive cardiology and heart failure",
    bio: "Priya looks after the blood pressure and cholesterol clinic and the heart failure follow-ups. Her appointments run long on purpose — most of the work is in the conversation.",
    languages: ["English", "Hindi"],
    yearsExperience: 11,
    consultationFeeAED: 500,
    shifts: [...shifts([2, 3, 4], 12, 20), ...shifts([6], 10, 16)],
    portrait: 3,
  },
  {
    id: "doc_baig",
    name: "Dr. Yusuf Baig",
    nameArabic: "د. يوسف بيغ",
    title: "Consultant",
    credentials: "MBBS, FRCS (ORL-HNS)",
    specialtyId: "spc_ent",
    focus: "Sinus disease and sleep-related breathing",
    bio: "Yusuf does the nasal endoscopy list and the snoring assessments. He is direct about which sinus problems need surgery and which need six weeks of doing the boring thing properly.",
    languages: ["English", "Urdu", "Arabic"],
    yearsExperience: 15,
    consultationFeeAED: 350,
    shifts: shifts([0, 1, 2, 3, 4], 9, 17),
    portrait: 4,
  },
  {
    id: "doc_rahman",
    name: "Dr. Aisha Rahman",
    nameArabic: "د. عائشة رحمن",
    title: "Specialist",
    credentials: "MBBS, MS (ENT)",
    specialtyId: "spc_ent",
    focus: "Audiology and paediatric ENT",
    bio: "Aisha runs the hearing clinic and sees most of the children with glue ear and recurrent tonsillitis, jointly with paediatrics when it helps.",
    languages: ["English", "Urdu", "Hindi"],
    yearsExperience: 10,
    consultationFeeAED: 350,
    shifts: [...shifts([1, 2, 3], 13, 20), ...shifts([6], 9, 15)],
    portrait: 5,
  },
  {
    id: "doc_haddad_a",
    name: "Amal Haddad",
    nameArabic: "أمل حداد",
    title: "Senior physiotherapist",
    credentials: "BSc Physiotherapy, MSc Musculoskeletal Rehabilitation",
    specialtyId: "spc_physio",
    focus: "Spinal and post-surgical rehabilitation",
    bio: "Amal leads the physiotherapy team and takes most of the post-operative knee and shoulder work. Every patient leaves the first session with a printed programme and a date to be reassessed.",
    languages: ["Arabic", "English"],
    yearsExperience: 10,
    consultationFeeAED: 380,
    shifts: [...shifts([0, 1, 2, 3, 4], 8, 16), ...shifts([6], 9, 14)],
    portrait: 6,
  },
];

/* -------------------------------------------------------------------------- */
/* Patients                                                                    */
/* -------------------------------------------------------------------------- */

interface PatientSeed {
  firstName: string;
  lastName: string;
  /** Age in years — turned into a date of birth relative to today. */
  age: number;
  gender: PatientGender;
  phone: string;
  /** Index into `site.insurers`, or null for self-paying patients. */
  insurer: number | null;
  allergies?: string;
  notes?: string;
}

const patientSeeds: PatientSeed[] = [
  { firstName: "Fatima", lastName: "Al Blooshi", age: 34, gender: "female", phone: "+971 50 441 8823", insurer: 0, allergies: "Penicillin — rash", notes: "Prefers a female doctor. Arabic first language." },
  { firstName: "Ahmed", lastName: "Al Zaabi", age: 52, gender: "male", phone: "+971 55 302 9174", insurer: 1, notes: "Type 2 diabetes, reviewed quarterly by Dr. Al Mansoori." },
  { firstName: "Mariam", lastName: "Al Suwaidi", age: 41, gender: "female", phone: "+971 56 118 4460", insurer: 0 },
  { firstName: "Khalid", lastName: "Al Nuaimi", age: 63, gender: "male", phone: "+971 50 774 2318", insurer: 2, allergies: "Aspirin", notes: "On blood pressure medication. Brings his own readings." },
  { firstName: "Noor", lastName: "Al Marzooqi", age: 7, gender: "female", phone: "+971 50 990 6612", insurer: 3, allergies: "Peanuts — carries an adrenaline pen", notes: "Mother attends all appointments. Asthma reviewed by Dr. Reyes." },
  { firstName: "Saeed", lastName: "Al Dhaheri", age: 29, gender: "male", phone: "+971 55 660 3387", insurer: null, notes: "Self-paying. Asks for a printed invoice each visit." },
  { firstName: "Aisha", lastName: "Al Ketbi", age: 46, gender: "female", phone: "+971 56 445 7729", insurer: 4 },
  { firstName: "Hamdan", lastName: "Al Rumaithi", age: 3, gender: "male", phone: "+971 50 223 9905", insurer: 3, notes: "Vaccination schedule up to date. Father is the contact." },
  { firstName: "Latifa", lastName: "Al Qubaisi", age: 58, gender: "female", phone: "+971 55 887 1140", insurer: 1, allergies: "Latex" },
  { firstName: "Rashid", lastName: "Al Ameri", age: 37, gender: "male", phone: "+971 50 512 6673", insurer: 0 },
  { firstName: "Shamma", lastName: "Al Falasi", age: 25, gender: "female", phone: "+971 56 774 2201", insurer: 5, notes: "Acne treatment plan with Dr. Duarte, month four." },
  { firstName: "Omar", lastName: "Haddad", age: 44, gender: "male", phone: "+971 50 338 8817", insurer: 2, notes: "Lower back rehab after a disc injury." },
  { firstName: "Rania", lastName: "Nasser", age: 33, gender: "female", phone: "+971 55 220 4498", insurer: 0 },
  { firstName: "Ziad", lastName: "Barakat", age: 61, gender: "male", phone: "+971 56 909 3325", insurer: 1, allergies: "Sulfa drugs", notes: "Cardiology follow-up every six months." },
  { firstName: "Dina", lastName: "Khoury", age: 39, gender: "female", phone: "+971 50 663 7712", insurer: 4 },
  { firstName: "Arjun", lastName: "Nair", age: 31, gender: "male", phone: "+971 55 449 0086", insurer: 3 },
  { firstName: "Priyanka", lastName: "Sharma", age: 28, gender: "female", phone: "+971 56 332 5590", insurer: 3, notes: "Works nights — asks for morning slots only." },
  { firstName: "Imran", lastName: "Qureshi", age: 49, gender: "male", phone: "+971 50 887 4432", insurer: 2, allergies: "Ibuprofen — stomach upset" },
  { firstName: "Fatima", lastName: "Siddiqui", age: 36, gender: "female", phone: "+971 55 771 2264", insurer: 5 },
  { firstName: "Vikram", lastName: "Patel", age: 55, gender: "male", phone: "+971 56 220 8873", insurer: 1, notes: "Treadmill test done in March, repeat due next year." },
  { firstName: "Ananya", lastName: "Iyer", age: 9, gender: "female", phone: "+971 50 554 1109", insurer: 3, allergies: "Dust mites" },
  { firstName: "Bilal", lastName: "Ahmed", age: 22, gender: "male", phone: "+971 55 118 7736", insurer: null, notes: "Self-paying student rate applied." },
  { firstName: "Maria", lastName: "Santos", age: 43, gender: "female", phone: "+971 56 664 3018", insurer: 4, notes: "Interpreter not needed. Prefers evening appointments." },
  { firstName: "Joselito", lastName: "Cruz", age: 47, gender: "male", phone: "+971 50 229 5567", insurer: 4 },
  { firstName: "Angeline", lastName: "Reyes", age: 30, gender: "female", phone: "+971 55 993 6641", insurer: 0 },
  { firstName: "James", lastName: "Whitfield", age: 57, gender: "male", phone: "+971 56 445 2290", insurer: 5, allergies: "Shellfish", notes: "Relocated from London, records transferred in March." },
  { firstName: "Claire", lastName: "Bennett", age: 38, gender: "female", phone: "+971 50 771 3384", insurer: 5 },
  { firstName: "Thomas", lastName: "Müller", age: 45, gender: "male", phone: "+971 55 336 9902", insurer: 2, notes: "Runner. Recurrent ankle problems, sees Amal Haddad." },
  { firstName: "Sarah", lastName: "O’Connor", age: 34, gender: "female", phone: "+971 56 882 1147", insurer: 1 },
  { firstName: "Daniel", lastName: "Fitzgerald", age: 66, gender: "male", phone: "+971 50 448 7723", insurer: 2, allergies: "Codeine", notes: "Hard of hearing — face him when speaking." },
];

/** Combining diacritics, so "Müller" normalises to "muller". */
const COMBINING_MARKS = /[̀-ͯ]/g;

function emailFor(seed: PatientSeed, index: number): string {
  const normalise = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(COMBINING_MARKS, "")
      .replace(/[^a-z]/g, "");
  return `${normalise(seed.firstName)}.${normalise(seed.lastName)}${index % 7 === 0 ? index : ""}@example.com`;
}

function buildSeedPatients(today: Date): Patient[] {
  return patientSeeds.map((seed, index) => {
    // Spread birthdays through the year so the age column is not all January.
    const birthDay = 1 + ((index * 11) % 27);
    const birthMonth = (index * 5) % 12;
    const birthYear = today.getFullYear() - seed.age;
    const dateOfBirth = format(
      new Date(birthYear, birthMonth, birthDay),
      "yyyy-MM-dd",
    );
    return {
      id: createId("pat"),
      firstName: seed.firstName,
      lastName: seed.lastName,
      email: emailFor(seed, index),
      phone: seed.phone,
      dateOfBirth,
      gender: seed.gender,
      insurer: seed.insurer === null ? null : site.insurers[seed.insurer],
      insuranceMemberId:
        seed.insurer === null
          ? null
          : `${site.insurers[seed.insurer].slice(0, 2).toUpperCase()}-${(480_000 + index * 137).toString()}`,
      allergies: seed.allergies ?? "",
      notes: seed.notes ?? "",
      // The first few registered in the last fortnight so the dashboard's
      // "new patients this month" figure is never a flat zero.
      createdAt: (index < 5
        ? subDays(today, 2 + index * 3)
        : subDays(today, 24 + index * 13)
      ).toISOString(),
    };
  });
}

/* -------------------------------------------------------------------------- */
/* Appointments                                                                */
/* -------------------------------------------------------------------------- */

/** Deterministic PRNG, so a refresh reproduces the same demo dataset. */
function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(random: () => number, items: readonly T[]): T {
  return items[Math.floor(random() * items.length)];
}

/** Reasons-for-visit, keyed by specialty, so the admin table reads plausibly. */
const reasonsBySpecialty: Record<string, string[]> = {
  spc_family: [
    "Persistent cough for two weeks",
    "Diabetes review and repeat prescription",
    "Blood pressure check",
    "Annual health screening",
    "Travel vaccinations before September",
    "Fatigue and low energy",
  ],
  spc_derm: [
    "Adult acne, not responding to over-the-counter cream",
    "Mole on shoulder has changed shape",
    "Eczema flare on hands",
    "Pigmentation on cheeks after summer",
    "Hair thinning at the crown",
    "Patch test for suspected cosmetic allergy",
  ],
  spc_paeds: [
    "Fever for three days",
    "Six-week newborn check",
    "Routine vaccination — 12-month schedule",
    "Night cough, possible asthma",
    "Weight gain slower than expected",
    "Recurrent ear infections",
  ],
  spc_cardio: [
    "Palpitations in the evenings",
    "Chest tightness when walking uphill",
    "Blood pressure not settling on current dose",
    "Pre-operative cardiac clearance",
    "Six-month heart failure review",
    "Follow-up after abnormal ECG",
  ],
  spc_ent: [
    "Blocked nose for two months",
    "Hearing has dropped in the left ear",
    "Recurrent tonsillitis",
    "Snoring and daytime sleepiness",
    "Dizziness on standing",
    "Ear wax removal",
  ],
  spc_physio: [
    "Lower back pain after lifting",
    "Post-operative knee rehabilitation, week four",
    "Shoulder pain reaching overhead",
    "Ankle sprain — return to running",
    "Neck and desk-related strain",
    "Hamstring strain from football",
  ],
};

const staffNotes = [
  "",
  "",
  "",
  "Patient asked for a reminder the day before.",
  "Insurance pre-approval on file.",
  "Bring previous scan reports.",
  "Rescheduled once at the patient’s request.",
  "Front desk to confirm by phone.",
];

interface BookedInterval {
  doctorId: string;
  start: Date;
  end: Date;
}

function buildSeedAppointments(
  today: Date,
  patients: Patient[],
  doctors: Doctor[],
  specialties: Specialty[],
): Appointment[] {
  const random = createRandom(0x414d43); // "AMC"
  const appointments: Appointment[] = [];
  const booked: BookedInterval[] = [];
  const statusCounters = { past: 0, today: 0, future: 0 };
  const specialtyById = new Map(specialties.map((item) => [item.id, item]));

  // Paediatric patients only fit paediatrics; everyone else skips it.
  const isChild = (patient: Patient) =>
    today.getFullYear() - Number(patient.dateOfBirth.slice(0, 4)) < 16;
  const childPatients = patients.filter(isChild);
  const adultPatients = patients.filter((patient) => !isChild(patient));

  for (let offset = -14; offset <= 14; offset += 1) {
    const day = startOfDay(addDays(today, offset));
    const workingDoctors = doctors.filter((doctor) =>
      shiftForDay(doctor.shifts, day),
    );
    if (workingDoctors.length === 0) continue;

    // One or two doctors see patients each day, one or two visits each — around
    // fifty appointments across the four-week window.
    const doctorCount = 1 + Math.floor(random() * 2);
    const chosen = [...workingDoctors]
      .sort(() => random() - 0.5)
      .slice(0, doctorCount);

    for (const doctor of chosen) {
      const shift = shiftForDay(doctor.shifts, day);
      if (!shift) continue;
      const specialty = specialtyById.get(doctor.specialtyId);
      if (!specialty) continue;

      const visits = random() < 0.55 ? 1 : 2;
      for (let visit = 0; visit < visits; visit += 1) {
        const service = pick(random, specialty.services);
        const starts = candidateStarts(shift, day).filter((start) =>
          slotFitsShift(start, service.durationMinutes, shift),
        );
        if (starts.length === 0) continue;

        const start = pick(random, starts);
        const end = addMinutes(start, service.durationMinutes);
        const clash = booked.some(
          (item) =>
            item.doctorId === doctor.id &&
            intervalsOverlap(start, end, item.start, item.end),
        );
        if (clash) continue;

        const pool =
          specialty.id === "spc_paeds" ? childPatients : adultPatients;
        if (pool.length === 0) continue;
        const patient = pick(random, pool);

        booked.push({ doctorId: doctor.id, start, end });

        const status = statusFor(offset, statusCounters);
        const channel = channelFor(random);
        const createdAt = subDays(start, 3 + Math.floor(random() * 12));

        appointments.push({
          id: createId("apt"),
          reference: createReference(),
          patientId: patient.id,
          doctorId: doctor.id,
          specialtyId: specialty.id,
          serviceId: service.id,
          startsAt: start.toISOString(),
          durationMinutes: service.durationMinutes,
          status,
          channel,
          reason: pick(random, reasonsBySpecialty[specialty.id] ?? []),
          notes: pick(random, staffNotes),
          feeAED: service.priceAED,
          createdAt: createdAt.toISOString(),
          updatedAt: createdAt.toISOString(),
        });
      }
    }
  }

  return appointments.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

/**
 * Statuses are dealt from fixed rotations rather than sampled, so the seeded
 * dataset always shows a plausible mix — a few dozen appointments is far too
 * small a sample for random draws to land near their intended proportions.
 */
const pastStatuses: AppointmentStatus[] = [
  "completed",
  "completed",
  "completed",
  "completed",
  "cancelled",
  "completed",
  "completed",
  "completed",
  "completed",
  "completed",
  "completed",
  "no-show",
  "completed",
  "completed",
  "completed",
  "cancelled",
];

const todayStatuses: AppointmentStatus[] = [
  "completed",
  "confirmed",
  "completed",
  "scheduled",
  "confirmed",
];

const futureStatuses: AppointmentStatus[] = [
  "confirmed",
  "scheduled",
  "confirmed",
  "scheduled",
  "scheduled",
  "confirmed",
  "scheduled",
  "cancelled",
  "confirmed",
  "scheduled",
];

function statusFor(
  dayOffset: number,
  counters: { past: number; today: number; future: number },
): AppointmentStatus {
  if (dayOffset < 0) {
    return pastStatuses[counters.past++ % pastStatuses.length];
  }
  if (dayOffset === 0) {
    return todayStatuses[counters.today++ % todayStatuses.length];
  }
  return futureStatuses[counters.future++ % futureStatuses.length];
}

function channelFor(random: () => number): BookingChannel {
  const roll = random();
  if (roll < 0.55) return "online";
  if (roll < 0.9) return "phone";
  return "walk-in";
}

/* -------------------------------------------------------------------------- */
/* Assembly                                                                    */
/* -------------------------------------------------------------------------- */

export interface SeedData {
  specialties: Specialty[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
}

export function buildSeedData(): SeedData {
  const today = startOfDay(new Date());
  const specialties = seedSpecialties.map((specialty) => ({
    ...specialty,
    services: specialty.services.map((service) => ({ ...service })),
  }));
  const doctors = seedDoctors.map((doctor) => ({
    ...doctor,
    shifts: doctor.shifts.map((shift) => ({ ...shift })),
  }));
  const patients = buildSeedPatients(today);
  const appointments = buildSeedAppointments(
    today,
    patients,
    doctors,
    specialties,
  );

  return { specialties, doctors, patients, appointments };
}
