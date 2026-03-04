import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { User, Briefcase, GraduationCap, Mail, Phone, MapPin, Globe, Plus, Trash2, Download, Eye, Palette, Upload, Camera } from 'lucide-react';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  photo: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
}

// DaisyUI-inspired color themes
const themes = {
  blue: { 
    primary: 'bg-blue-600', 
    secondary: 'bg-blue-50', 
    text: 'text-blue-600', 
    border: 'border-blue-600',
    preview: 'bg-gradient-to-br from-blue-600 to-blue-800'
  },
  green: { 
    primary: 'bg-emerald-600', 
    secondary: 'bg-emerald-50', 
    text: 'text-emerald-600', 
    border: 'border-emerald-600',
    preview: 'bg-gradient-to-br from-emerald-600 to-emerald-800'
  },
  red: { 
    primary: 'bg-rose-600', 
    secondary: 'bg-rose-50', 
    text: 'text-rose-600', 
    border: 'border-rose-600',
    preview: 'bg-gradient-to-br from-rose-600 to-rose-800'
  },
  gray: { 
    primary: 'bg-slate-700', 
    secondary: 'bg-slate-50', 
    text: 'text-slate-700', 
    border: 'border-slate-700',
    preview: 'bg-gradient-to-br from-slate-700 to-slate-900'
  },
  amber: { 
    primary: 'bg-amber-600', 
    secondary: 'bg-amber-50', 
    text: 'text-amber-600', 
    border: 'border-amber-600',
    preview: 'bg-gradient-to-br from-amber-600 to-amber-800'
  },
  teal: { 
    primary: 'bg-teal-600', 
    secondary: 'bg-teal-50', 
    text: 'text-teal-600', 
    border: 'border-teal-600',
    preview: 'bg-gradient-to-br from-teal-600 to-teal-800'
  },
  cyan: { 
    primary: 'bg-cyan-600', 
    secondary: 'bg-cyan-50', 
    text: 'text-cyan-600', 
    border: 'border-cyan-600',
    preview: 'bg-gradient-to-br from-cyan-600 to-cyan-800'
  },
  lime: { 
    primary: 'bg-lime-600', 
    secondary: 'bg-lime-50', 
    text: 'text-lime-700', 
    border: 'border-lime-600',
    preview: 'bg-gradient-to-br from-lime-600 to-lime-800'
  },
};

type ThemeKey = keyof typeof themes;

export default function App() {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [theme, setTheme] = useState<ThemeKey>('blue');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null); // ✅ AJOUTÉ
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: 'Jean',
    lastName: 'Dupont',
    title: 'Développeur Full Stack',
    email: 'jean.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    website: 'www.jeandupont.fr',
    summary: 'Développeur passionné avec 5+ années d\'expérience dans le développement web. Spécialisé dans les technologies modernes comme React, Node.js et TypeScript. Toujours à la recherche de nouveaux défis pour créer des applications performantes et évolutives.',
    photo: ''
  });

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      company: 'TechCorp Solutions',
      position: 'Développeur Full Stack',
      startDate: '2021-01',
      endDate: '',
      current: true,
      description: '• Développement d\'applications web avec React et Node.js\n• Mise en place d\'APIs RESTful et GraphQL\n• Gestion de bases de données PostgreSQL et MongoDB\n• Déploiement sur AWS et Docker'
    },
    {
      id: '2',
      company: 'StartupXYZ',
      position: 'Développeur Frontend',
      startDate: '2019-03',
      endDate: '2020-12',
      current: false,
      description: '• Création d\'interfaces utilisateur réactives avec Vue.js\n• Intégration d\'APIs et gestion d\'état avec Vuex\n• Optimisation des performances web'
    }
  ]);

  const [educations, setEducations] = useState<Education[]>([
    {
      id: '1',
      school: 'École Polytechnique de Paris',
      degree: 'Master',
      field: 'Informatique',
      startDate: '2016-09',
      endDate: '2019-06'
    },
    {
      id: '2',
      school: 'Lycée Louis-le-Grand',
      degree: 'Licence',
      field: 'Mathématiques et Informatique',
      startDate: '2013-09',
      endDate: '2016-06'
    }
  ]);

  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'React', level: 95 },
    { id: '2', name: 'TypeScript', level: 90 },
    { id: '3', name: 'Node.js', level: 85 },
    { id: '4', name: 'PostgreSQL', level: 80 },
    { id: '5', name: 'Docker', level: 75 },
    { id: '6', name: 'AWS', level: 70 }
  ]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonalInfo({ ...personalInfo, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPersonalInfo({ ...personalInfo, photo: '' });
  };

  const addExperience = () => {
    setExperiences([...experiences, {
      id: generateId(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setExperiences(experiences.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const addEducation = () => {
    setEducations([...educations, {
      id: generateId(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: ''
    }]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducations(educations.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id: string) => {
    setEducations(educations.filter(edu => edu.id !== id));
  };

  const addSkill = () => {
    setSkills([...skills, { id: generateId(), name: '', level: 50 }]);
  };

  const updateSkill = (id: string, field: keyof Skill, value: string | number) => {
    setSkills(skills.map(skill =>
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

const generatePDF = async () => {
  try {
    setIsGenerating(true);

    if (activeTab !== 'preview') {
      setActiveTab('preview');
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const element = previewRef.current;
    if (!element) return;

    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const img = new Image();
    img.src = dataUrl;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (img.height * pdfWidth) / img.width;

    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${personalInfo.lastName}_${personalInfo.firstName}_CV.pdf`);

  } catch (error) {
    console.error("Erreur génération PDF :", error);
  } finally {
    setIsGenerating(false);
  }
};
  const currentTheme = themes[theme];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`${currentTheme.primary} p-3 rounded-xl shadow-lg`}>
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CV Creator Pro</h1>
                <p className="text-sm text-gray-500">Générez votre CV professionnel en quelques clics</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Theme Picker */}
              <div className="relative">
                <button
                  onClick={() => setShowThemePicker(!showThemePicker)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Palette className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-700">Thème</span>
                  <div className={`w-4 h-4 rounded-full ${currentTheme.primary}`}></div>
                </button>
                {showThemePicker && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-20">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Choisissez un thème</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {Object.entries(themes).map(([key, value]) => (
                        <button
                          key={key}
                          onClick={() => {
                            setTheme(key as ThemeKey);
                            setShowThemePicker(false);
                          }}
                          className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                            theme === key ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-400' : 'border-transparent'
                          } ${value.preview}`}
                          title={key.charAt(0).toUpperCase() + key.slice(1)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Tab Toggle */}
              <div className="flex rounded-xl shadow-sm border border-gray-300 overflow-hidden bg-white">
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`flex items-center gap-2 px-5 py-2.5 font-medium transition-colors ${
                    activeTab === 'edit' 
                      ? `${currentTheme.primary} text-white` 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Éditer
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-2 px-5 py-2.5 font-medium transition-colors ${
                    activeTab === 'preview' 
                      ? `${currentTheme.primary} text-white` 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Aperçu
                </button>
              </div>
              
              {/* Download Button */}
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-6 py-2.5 ${currentTheme.primary} text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Génération...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Télécharger PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === 'edit' ? (
          <div className="space-y-8">
            {/* Personal Info Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 transition-all hover:shadow-md">
              <div className="flex items-center gap-4 mb-8">
                <div className={`${currentTheme.secondary} p-4 rounded-xl shadow-sm`}>
                  <User className={`w-6 h-6 ${currentTheme.text}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Informations Personnelles</h2>
                  <p className="text-gray-500">Ajoutez vos coordonnées et photo</p>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Photo Upload */}
                <div className="flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div className="w-40 h-40 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 mb-4 hover:border-gray-400 transition-colors">
                      {personalInfo.photo ? (
                        <img 
                          src={personalInfo.photo} 
                          alt="Photo" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <span className="text-xs text-gray-500">400x400px recommandé</span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      ref={fileInputRef}
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex items-center gap-2 px-4 py-2.5 ${currentTheme.secondary} ${currentTheme.text} rounded-xl hover:opacity-80 transition-opacity font-medium shadow-sm`}
                      >
                        <Upload className="w-4 h-4" />
                        Ajouter photo
                      </button>
                      {personalInfo.photo && (
                        <button
                          onClick={removePhoto}
                          className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Personal Information Form */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
                    <input
                      type="text"
                      value={personalInfo.firstName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
                      placeholder="Jean"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
                    <input
                      type="text"
                      value={personalInfo.lastName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
                      placeholder="Dupont"
                    />
                  </div>
                  <div className="md:col-span-2 group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Titre Professionnel</label>
                    <input
                      type="text"
                      value={personalInfo.title}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
                      placeholder="Développeur Full Stack"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
                      placeholder="jean.dupont@email.com"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Localisation</label>
                    <input
                      type="text"
                      value={personalInfo.location}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
                      placeholder="Paris, France"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Site Web</label>
                    <input
                      type="text"
                      value={personalInfo.website}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
                      placeholder="www.jeandupont.fr"
                    />
                  </div>
                  <div className="md:col-span-2 group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Résumé Professionnel</label>
                    <textarea
                      value={personalInfo.summary}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 resize-none"
                      placeholder="Décrivez brièvement votre parcours professionnel, vos compétences clés et vos objectifs de carrière..."
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Experience Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`${currentTheme.secondary} p-4 rounded-xl shadow-sm`}>
                    <Briefcase className={`w-6 h-6 ${currentTheme.text}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Expériences Professionnelles</h2>
                    <p className="text-gray-500">Détaillez votre parcours professionnel</p>
                  </div>
                </div>
                <button
                  onClick={addExperience}
                  className={`flex items-center gap-2 px-5 py-3 ${currentTheme.primary} text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl font-medium`}
                >
                  <Plus className="w-5 h-5" />
                  Ajouter une expérience
                </button>
              </div>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="border-2 border-gray-100 rounded-2xl p-6 transition-all hover:border-gray-200 hover:shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${currentTheme.secondary} flex items-center justify-center`}>
                          <span className={`font-bold ${currentTheme.text}`}>{index + 1}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-500">Expérience #{index + 1}</span>
                      </div>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="Supprimer cette expérience"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Entreprise</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
                          placeholder="Nom de l'entreprise"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Poste</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
                          placeholder="Votre poste"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Date de début</label>
                        <input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Date de fin</label>
                        <input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          disabled={exp.current}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                          className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`current-${exp.id}`} className="text-base font-medium text-gray-700">
                          Je travaille actuellement dans ce poste
                        </label>
                      </div>
                    </div>
                    <div className="mt-6 group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description des missions</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 resize-none"
                        placeholder="• Développement d'applications web avec React et Node.js\n• Mise en place d'APIs RESTful et GraphQL\n• Gestion de bases de données PostgreSQL et MongoDB"
                      />
                      <p className="text-xs text-gray-500 mt-2">Utilisez des puces (•) pour lister vos missions et réalisations</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`${currentTheme.secondary} p-4 rounded-xl shadow-sm`}>
                    <GraduationCap className={`w-6 h-6 ${currentTheme.text}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Formation</h2>
                    <p className="text-gray-500">Indiquez votre parcours académique</p>
                  </div>
                </div>
                <button
                  onClick={addEducation}
                  className={`flex items-center gap-2 px-5 py-3 ${currentTheme.primary} text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl font-medium`}
                >
                  <Plus className="w-5 h-5" />
                  Ajouter une formation
                </button>
              </div>
              <div className="space-y-6">
                {educations.map((edu, index) => (
                  <div key={edu.id} className="border-2 border-gray-100 rounded-2xl p-6 transition-all hover:border-gray-200 hover:shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${currentTheme.secondary} flex items-center justify-center`}>
                          <span className={`font-bold ${currentTheme.text}`}>{index + 1}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-500">Formation #{index + 1}</span>
                      </div>
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="Supprimer cette formation"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2 group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Établissement</label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
                          placeholder="Nom de l'école ou de l'université"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Diplôme</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
                          placeholder="Bac, Licence, Master, Doctorat..."
                        />
                      </div>
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Domaine d'étude</label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
                          placeholder="Informatique, Mathématiques, Gestion..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Année de début</label>
                          <input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
                          />
                        </div>
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Année de fin</label>
                          <input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`${currentTheme.secondary} p-4 rounded-xl shadow-sm`}>
                    <svg className={`w-6 h-6 ${currentTheme.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Compétences</h2>
                    <p className="text-gray-500">Mettez en valeur vos compétences techniques</p>
                  </div>
                </div>
                <button
                  onClick={addSkill}
                  className={`flex items-center gap-2 px-5 py-3 ${currentTheme.primary} text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl font-medium`}
                >
                  <Plus className="w-5 h-5" />
                  Ajouter une compétence
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {skills.map((skill, index) => (
                  <div key={skill.id} className="flex flex-col p-6 border-2 border-gray-100 rounded-2xl transition-all hover:border-gray-200 hover:shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${currentTheme.secondary} flex items-center justify-center`}>
                          <span className={`text-sm font-bold ${currentTheme.text}`}>{index + 1}</span>
                        </div>
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                          className="flex-1 px-3 py-2 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-500 transition-all text-gray-900 font-medium text-lg"
                          placeholder="Nom de la compétence"
                        />
                      </div>
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="Supprimer cette compétence"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={skill.level}
                          onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>
                      <div className="flex items-center justify-center w-14 h-10 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="text-lg font-bold text-gray-700">{skill.level}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                      <span>Débutant</span>
                      <span>Intermédiaire</span>
                      <span>Expert</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          /* Preview Section */
          <div className="flex flex-col items-center">
            <div className="w-full max-w-4xl mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Aperçu de votre CV</h2>
                <p className="text-gray-500">Vérifiez le rendu avant de télécharger</p>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className={`w-3 h-3 rounded-full ${currentTheme.primary}`}></div>
                <span className="font-medium text-gray-700">
                  Thème: {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </span>
              </div>
            </div>
            
            <div 
              ref={previewRef}
              id="cv-preview"
              className="bg-white shadow-2xl w-full max-w-4xl rounded-2xl overflow-hidden"
              style={{ minHeight: '1122px' }} 
            >
              {/* CV Header */}
              <div className={`${currentTheme.preview} text-white p-12 relative overflow-hidden`}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Photo in preview */}
                  {personalInfo.photo && (
                    <div className="flex-shrink-0">
                      <div className="w-36 h-36 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden bg-white/10 backdrop-blur-sm">
                        <img 
                          src={personalInfo.photo} 
                          alt="Photo" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Name and title */}
                  <div className="text-center md:text-left flex-1">
                    <h1 className="text-5xl font-extrabold mb-3 tracking-tight">
                      {personalInfo.firstName} <span className="font-light">{personalInfo.lastName}</span>
                    </h1>
                    <p className="text-2xl font-light opacity-95 mb-6">{personalInfo.title}</p>
                    
                    {/* Contact info */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 text-sm">
                      {personalInfo.email && (
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                          <Mail className="w-4 h-4" />
                          <span>{personalInfo.email}</span>
                        </div>
                      )}
                      {personalInfo.phone && (
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                          <Phone className="w-4 h-4" />
                          <span>{personalInfo.phone}</span>
                        </div>
                      )}
                      {personalInfo.location && (
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{personalInfo.location}</span>
                        </div>
                      )}
                      {personalInfo.website && (
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                          <Globe className="w-4 h-4" />
                          <span>{personalInfo.website}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* CV Content */}
              <div className="p-12">
                {/* Professional Summary */}
                {personalInfo.summary && (
                  <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-1 h-8 ${currentTheme.primary} rounded-full`}></div>
                      <h2 className={`text-2xl font-bold ${currentTheme.text} uppercase tracking-wide`}>
                        Profil Professionnel
                      </h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {personalInfo.summary}
                    </p>
                  </section>
                )}

                {/* Professional Experience */}
                {experiences.length > 0 && (
                  <section className="mb-12">
                    <div className="flex items-center gap-3 mb-8">
                      <div className={`w-1 h-8 ${currentTheme.primary} rounded-full`}></div>
                      <h2 className={`text-2xl font-bold ${currentTheme.text} uppercase tracking-wide`}>
                        Expériences Professionnelles
                      </h2>
                    </div>
                    <div className="space-y-10">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="relative pl-8 border-l-2 border-gray-100">
                          <div className={`absolute -left-2.5 top-0 w-5 h-5 rounded-full ${currentTheme.primary} border-4 border-white shadow-md`}></div>
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{exp.position}</h3>
                              <p className={`text-lg font-medium ${currentTheme.text}`}>{exp.company}</p>
                            </div>
                            <div className="mt-2 md:mt-0 md:text-right">
                              <span className="inline-flex items-center px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                {exp.startDate && new Date(exp.startDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                                {' - '}
                                {exp.current ? (
                                  <span className={`font-semibold ${currentTheme.text}`}>Présent</span>
                                ) : (
                                  exp.endDate ? new Date(exp.endDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : ''
                                )}
                              </span>
                            </div>
                          </div>
                          {exp.description && (
                            <div className="text-gray-700 whitespace-pre-line mt-4 leading-relaxed">
                              {exp.description.split('\n').map((line, index) => (
                                <p key={index} className="mb-2 last:mb-0">{line}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Education */}
                {educations.length > 0 && (
                  <section className="mb-12">
                    <div className="flex items-center gap-3 mb-8">
                      <div className={`w-1 h-8 ${currentTheme.primary} rounded-full`}></div>
                      <h2 className={`text-2xl font-bold ${currentTheme.text} uppercase tracking-wide`}>
                        Formation
                      </h2>
                    </div>
                    <div className="space-y-8">
                      {educations.map((edu) => (
                        <div key={edu.id} className="relative pl-8 border-l-2 border-gray-100">
                          <div className={`absolute -left-2.5 top-0 w-5 h-5 rounded-full ${currentTheme.primary} border-4 border-white shadow-md`}></div>
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{edu.school}</h3>
                              <p className="text-gray-700 text-lg">
                                <span className="font-medium">{edu.degree}</span>
                                {edu.field && <span className="text-gray-500"> en {edu.field}</span>}
                              </p>
                            </div>
                            <div className="mt-2 md:mt-0">
                              <span className="inline-flex items-center px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                {edu.startDate && new Date(edu.startDate).toLocaleDateString('fr-FR', { year: 'numeric' })}
                                {' - '}
                                {edu.endDate ? new Date(edu.endDate).toLocaleDateString('fr-FR', { year: 'numeric' }) : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                  <section>
                    <div className="flex items-center gap-3 mb-8">
                      <div className={`w-1 h-8 ${currentTheme.primary} rounded-full`}></div>
                      <h2 className={`text-2xl font-bold ${currentTheme.text} uppercase tracking-wide`}>
                        Compétences
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {skills.map((skill) => (
                        <div key={skill.id} className="group">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-800 font-semibold text-lg">{skill.name}</span>
                            <span className={`text-sm font-bold ${currentTheme.text}`}>{skill.level}%</span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                            <div
                              className={`h-full ${currentTheme.primary} rounded-full transition-all duration-1000 ease-out`}
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                          {/* Skill level indicator */}
                          <div className="flex justify-between mt-1 text-xs text-gray-400">
                            <span>{skill.level < 40 ? 'Débutant' : skill.level < 70 ? 'Intermédiaire' : 'Expert'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
              
              {/* Footer */}
              <div className="bg-gray-50 px-12 py-6 border-t border-gray-100">
                <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
                  <p>CV généré avec CV Creator Pro • {new Date().toLocaleDateString('fr-FR')}</p>
                  <p className="mt-2 md:mt-0">{personalInfo.firstName} {personalInfo.lastName} - Tous droits réservés</p>
                </div>
              </div>
            </div>
            
            {/* Quick actions */}
            <div className="fixed bottom-8 right-8 flex flex-col gap-3">
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-6 py-4 ${currentTheme.primary} text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all disabled:opacity-70 disabled:cursor-not-allowed font-semibold text-lg`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Télécharger le CV
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className={`${currentTheme.primary} p-2 rounded-lg`}>
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CV Creator Pro</span>
            </div>
            <p className="text-gray-500 text-center md:text-right">
              Créez des CV professionnels en quelques minutes • {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
