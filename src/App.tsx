import { useState, useRef } from 'react';
import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import { 
  User, Briefcase, GraduationCap, Mail, Phone, MapPin, Globe, 
  Plus, Trash2, Download, Eye, Palette, Upload, Camera, Menu, X, Edit3 
} from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: 'Jean',
    lastName: 'Dupont',
    title: 'Développeur Full Stack',
    email: 'jean.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    website: 'www.jeandupont.fr',
    summary: 'Développeur passionné avec 5+ années d\'expérience dans le développement web. Spécialisé dans les technologies modernes comme React, Node.js et TypeScript.',
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
      description: '• Développement d\'applications web avec React et Node.js\n• Mise en place d\'APIs RESTful et GraphQL'
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
    }
  ]);

  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'React', level: 95 },
    { id: '2', name: 'TypeScript', level: 90 },
    { id: '3', name: 'Node.js', level: 85 }
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

      const dataUrl = await toJpeg(element, {
        quality: 1,
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

      pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
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
      {/* Header - Responsive */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-auto sm:py-4">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`${currentTheme.primary} p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg`}>
                <Briefcase className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden xs:block">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">CV Creator Pro</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Générez votre CV professionnel</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme Picker */}
              <div className="relative">
                <button
                  onClick={() => setShowThemePicker(!showThemePicker)}
                  className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                >
                  <Palette className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
                  <span className="font-medium text-gray-700 hidden lg:inline">Thème</span>
                  <div className={`w-4 h-4 rounded-full ${currentTheme.primary}`}></div>
                </button>
                {showThemePicker && (
                  <div className="absolute right-0 mt-2 w-64 lg:w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-3 lg:p-4 z-20">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Choisissez un thème</h3>
                    <div className="grid grid-cols-4 gap-2 lg:gap-3">
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
                  className={`flex items-center gap-2 px-3 lg:px-5 py-2 lg:py-2.5 font-medium transition-colors ${
                    activeTab === 'edit'
                      ? `${currentTheme.primary} text-white`
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="hidden lg:inline">Éditer</span>
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-2 px-3 lg:px-5 py-2 lg:py-2.5 font-medium transition-colors ${
                    activeTab === 'preview'
                      ? `${currentTheme.primary} text-white`
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden lg:inline">Aperçu</span>
                </button>
              </div>

              {/* Download Button */}
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 ${currentTheme.primary} text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 font-medium`}
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span className="hidden lg:inline">{isGenerating ? 'Génération...' : 'Télécharger PDF'}</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              {/* Mobile Tab Toggle */}
              <div className="flex rounded-lg shadow-sm border border-gray-300 overflow-hidden bg-white">
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`p-2 ${activeTab === 'edit' ? `${currentTheme.primary} text-white` : 'text-gray-700'}`}
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`p-2 ${activeTab === 'preview' ? `${currentTheme.primary} text-white` : 'text-gray-700'}`}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 space-y-3">
              {/* Theme Selection */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Thème</p>
                <div className="grid grid-cols-8 gap-2">
                  {Object.entries(themes).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setTheme(key as ThemeKey)}
                      className={`aspect-square rounded-lg border-2 ${
                        theme === key ? 'border-gray-900 ring-2 ring-offset-1 ring-gray-400' : 'border-transparent'
                      } ${value.preview}`}
                    />
                  ))}
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={() => {
                  generatePDF();
                  setMobileMenuOpen(false);
                }}
                disabled={isGenerating}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${currentTheme.primary} text-white rounded-xl shadow-lg font-medium`}
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
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {activeTab === 'edit' ? (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Personal Info Section */}
            <section className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className={`${currentTheme.secondary} p-3 sm:p-4 rounded-xl shadow-sm w-fit`}>
                  <User className={`w-5 h-5 sm:w-6 sm:h-6 ${currentTheme.text}`} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Informations Personnelles</h2>
                  <p className="text-sm sm:text-base text-gray-500">Ajoutez vos coordonnées et photo</p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Photo Upload */}
                <div className="flex flex-col items-center lg:flex-shrink-0">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 mb-3 sm:mb-4">
                    {personalInfo.photo ? (
                      <img src={personalInfo.photo} alt="Photo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-2 sm:p-4">
                        <Camera className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-1 sm:mb-2" />
                        <span className="text-xs text-gray-500">400x400px</span>
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
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm ${currentTheme.secondary} ${currentTheme.text} rounded-lg sm:rounded-xl font-medium`}
                    >
                      <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Ajouter</span> photo
                    </button>
                    {personalInfo.photo && (
                      <button
                        onClick={removePhoto}
                        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm bg-red-50 text-red-600 rounded-lg sm:rounded-xl font-medium"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Prénom</label>
                    <input
                      type="text"
                      value={personalInfo.firstName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Jean"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Nom</label>
                    <input
                      type="text"
                      value={personalInfo.lastName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Dupont"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Titre Professionnel</label>
                    <input
                      type="text"
                      value={personalInfo.title}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Développeur Full Stack"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Email</label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="jean@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Localisation</label>
                    <input
                      type="text"
                      value={personalInfo.location}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Paris, France"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Site Web</label>
                    <input
                      type="text"
                      value={personalInfo.website}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="www.site.fr"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Résumé Professionnel</label>
                    <textarea
                      value={personalInfo.summary}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="Décrivez brièvement votre parcours..."
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Experience Section */}
            <section className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`${currentTheme.secondary} p-3 sm:p-4 rounded-xl shadow-sm`}>
                    <Briefcase className={`w-5 h-5 sm:w-6 sm:h-6 ${currentTheme.text}`} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Expériences</h2>
                    <p className="text-sm sm:text-base text-gray-500 hidden sm:block">Détaillez votre parcours</p>
                  </div>
                </div>
                <button
                  onClick={addExperience}
                  className={`flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 ${currentTheme.primary} text-white rounded-xl font-medium text-sm sm:text-base`}
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Ajouter</span>
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="border-2 border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${currentTheme.secondary} flex items-center justify-center`}>
                          <span className={`font-bold text-sm sm:text-base ${currentTheme.text}`}>{index + 1}</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-500">Expérience #{index + 1}</span>
                      </div>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg sm:rounded-xl"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Entreprise</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nom de l'entreprise"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Poste</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Votre poste"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Date de début</label>
                        <input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Date de fin</label>
                        <input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          disabled={exp.current}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>
                      <div className="sm:col-span-2 flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-blue-600"
                        />
                        <label htmlFor={`current-${exp.id}`} className="text-sm sm:text-base font-medium text-gray-700">
                          Poste actuel
                        </label>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Description</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          rows={4}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="• Vos missions et réalisations..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education Section */}
            <section className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`${currentTheme.secondary} p-3 sm:p-4 rounded-xl shadow-sm`}>
                    <GraduationCap className={`w-5 h-5 sm:w-6 sm:h-6 ${currentTheme.text}`} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Formation</h2>
                    <p className="text-sm sm:text-base text-gray-500 hidden sm:block">Parcours académique</p>
                  </div>
                </div>
                <button
                  onClick={addEducation}
                  className={`flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 ${currentTheme.primary} text-white rounded-xl font-medium text-sm sm:text-base`}
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Ajouter</span>
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {educations.map((edu, index) => (
                  <div key={edu.id} className="border-2 border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${currentTheme.secondary} flex items-center justify-center`}>
                          <span className={`font-bold text-sm sm:text-base ${currentTheme.text}`}>{index + 1}</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-500">Formation #{index + 1}</span>
                      </div>
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg sm:rounded-xl"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Établissement</label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nom de l'école"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Diplôme</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Licence, Master..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Domaine</label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Informatique..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Début</label>
                        <input
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Fin</label>
                        <input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills Section */}
            <section className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`${currentTheme.secondary} p-3 sm:p-4 rounded-xl shadow-sm`}>
                    <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${currentTheme.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Compétences</h2>
                    <p className="text-sm sm:text-base text-gray-500 hidden sm:block">Vos compétences techniques</p>
                  </div>
                </div>
                <button
                  onClick={addSkill}
                  className={`flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 ${currentTheme.primary} text-white rounded-xl font-medium text-sm sm:text-base`}
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Ajouter</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                {skills.map((skill, index) => (
                  <div key={skill.id} className="flex flex-col p-4 sm:p-6 border-2 border-gray-100 rounded-xl sm:rounded-2xl">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg ${currentTheme.secondary} flex items-center justify-center flex-shrink-0`}>
                          <span className={`text-xs sm:text-sm font-bold ${currentTheme.text}`}>{index + 1}</span>
                        </div>
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                          className="flex-1 min-w-0 px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-500 font-medium"
                          placeholder="Compétence"
                        />
                      </div>
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg flex-shrink-0 ml-2"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
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
                      <div className="w-12 sm:w-14 h-8 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl bg-gray-50 border border-gray-200 flex-shrink-0">
                        <span className="text-sm sm:text-lg font-bold text-gray-700">{skill.level}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          /* Preview Section - Responsive */
          <div className="flex flex-col items-center">
            {/* Preview Header */}
            <div className="w-full max-w-4xl mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Aperçu du CV</h2>
                  <p className="text-sm sm:text-base text-gray-500">Vérifiez avant de télécharger</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {/* Zoom Controls for Mobile */}
                  <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <button
                      onClick={() => setPreviewScale(Math.max(0.5, previewScale - 0.1))}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <span className="text-lg font-bold text-gray-600">−</span>
                    </button>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 min-w-[3rem] text-center">
                      {Math.round(previewScale * 100)}%
                    </span>
                    <button
                      onClick={() => setPreviewScale(Math.min(1.5, previewScale + 0.1))}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <span className="text-lg font-bold text-gray-600">+</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 sm:py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className={`w-3 h-3 rounded-full ${currentTheme.primary}`}></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 capitalize">{theme}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CV Preview Container with scroll */}
            <div className="w-full overflow-x-auto pb-4">
              <div 
                className="mx-auto transition-transform duration-200"
                style={{ 
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top center',
                  width: 'fit-content'
                }}
              >
                <div
                  ref={previewRef}
                  id="cv-preview"
                  className="bg-white shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden"
                  style={{ width: '794px', minHeight: '1122px' }}
                >
                  {/* CV Header */}
                  <div className={`${currentTheme.preview} text-white p-6 sm:p-8 lg:p-12 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-36 sm:w-48 h-36 sm:h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
                      {personalInfo.photo && (
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden">
                            <img src={personalInfo.photo} alt="Photo" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      )}

                      <div className="text-center sm:text-left flex-1">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 sm:mb-3 tracking-tight">
                          {personalInfo.firstName} <span className="font-light">{personalInfo.lastName}</span>
                        </h1>
                        <p className="text-lg sm:text-xl lg:text-2xl font-light opacity-95 mb-4 sm:mb-6">{personalInfo.title}</p>

                        <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 text-xs sm:text-sm">
                          {personalInfo.email && (
                            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{personalInfo.email}</span>
                            </div>
                          )}
                          {personalInfo.phone && (
                            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                              <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{personalInfo.phone}</span>
                            </div>
                          )}
                          {personalInfo.location && (
                            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{personalInfo.location}</span>
                            </div>
                          )}
                          {personalInfo.website && (
                            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                              <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{personalInfo.website}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CV Content */}
                  <div className="p-6 sm:p-8 lg:p-12">
                    {/* Professional Summary */}
                    {personalInfo.summary && (
                      <section className="mb-8 sm:mb-10 lg:mb-12">
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                          <div className={`w-1 h-6 sm:h-8 ${currentTheme.primary} rounded-full`}></div>
                          <h2 className={`text-xl sm:text-2xl font-bold ${currentTheme.text} uppercase tracking-wide`}>
                            Profil Professionnel
                          </h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                          {personalInfo.summary}
                        </p>
                      </section>
                    )}

                    {/* Professional Experience */}
                    {experiences.length > 0 && (
                      <section className="mb-8 sm:mb-10 lg:mb-12">
                        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                          <div className={`w-1 h-6 sm:h-8 ${currentTheme.primary} rounded-full`}></div>
                          <h2 className={`text-xl sm:text-2xl font-bold ${currentTheme.text} uppercase tracking-wide`}>
                            Expériences
                          </h2>
                        </div>
                        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                          {experiences.map((exp) => (
                            <div key={exp.id} className="relative pl-6 sm:pl-8 border-l-2 border-gray-100">
                              <div className={`absolute -left-2 sm:-left-2.5 top-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full ${currentTheme.primary} border-4 border-white shadow-md`}></div>
                              <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4">
                                <div>
                                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{exp.position}</h3>
                                  <p className={`text-base sm:text-lg font-medium ${currentTheme.text}`}>{exp.company}</p>
                                </div>
                                <span className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium w-fit">
                                  {exp.startDate && new Date(exp.startDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                                  {' - '}
                                  {exp.current ? (
                                    <span className={`font-semibold ${currentTheme.text}`}>Présent</span>
                                  ) : (
                                    exp.endDate ? new Date(exp.endDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : ''
                                  )}
                                </span>
                              </div>
                              {exp.description && (
                                <div className="text-gray-700 whitespace-pre-line text-sm sm:text-base leading-relaxed">
                                  {exp.description.split('\n').map((line, index) => (
                                    <p key={index} className="mb-1.5 sm:mb-2 last:mb-0">{line}</p>
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
                      <section className="mb-8 sm:mb-10 lg:mb-12">
                        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                          <div className={`w-1 h-6 sm:h-8 ${currentTheme.primary} rounded-full`}></div>
                          <h2 className={`text-xl sm:text-2xl font-bold ${currentTheme.text} uppercase tracking-wide`}>
                            Formation
                          </h2>
                        </div>
                        <div className="space-y-6 sm:space-y-8">
                          {educations.map((edu) => (
                            <div key={edu.id} className="relative pl-6 sm:pl-8 border-l-2 border-gray-100">
                              <div className={`absolute -left-2 sm:-left-2.5 top-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full ${currentTheme.primary} border-4 border-white shadow-md`}></div>
                              <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{edu.school}</h3>
                                  <p className="text-gray-700 text-base sm:text-lg">
                                    <span className="font-medium">{edu.degree}</span>
                                    {edu.field && <span className="text-gray-500"> en {edu.field}</span>}
                                  </p>
                                </div>
                                <span className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium w-fit">
                                  {edu.startDate && new Date(edu.startDate).toLocaleDateString('fr-FR', { year: 'numeric' })}
                                  {' - '}
                                  {edu.endDate ? new Date(edu.endDate).toLocaleDateString('fr-FR', { year: 'numeric' }) : ''}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                      <section>
                        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                          <div className={`w-1 h-6 sm:h-8 ${currentTheme.primary} rounded-full`}></div>
                          <h2 className={`text-xl sm:text-2xl font-bold ${currentTheme.text} uppercase tracking-wide`}>
                            Compétences
                          </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          {skills.map((skill) => (
                            <div key={skill.id}>
                              <div className="flex justify-between mb-1.5 sm:mb-2">
                                <span className="text-gray-800 font-semibold text-base sm:text-lg">{skill.name}</span>
                                <span className={`text-xs sm:text-sm font-bold ${currentTheme.text}`}>{skill.level}%</span>
                              </div>
                              <div className="h-2 sm:h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                <div
                                  className={`h-full ${currentTheme.primary} rounded-full`}
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-50 px-6 sm:px-8 lg:px-12 py-4 sm:py-6 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-gray-500 gap-2">
                      <p>CV généré avec CV Creator Pro • {new Date().toLocaleDateString('fr-FR')}</p>
                      <p>{personalInfo.firstName} {personalInfo.lastName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Download Button */}
            <div className="fixed bottom-4 sm:bottom-6 lg:bottom-8 left-4 right-4 sm:left-auto sm:right-6 lg:right-8 z-40">
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-4 ${currentTheme.primary} text-white rounded-xl sm:rounded-2xl shadow-2xl font-semibold text-base sm:text-lg`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Génération...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Télécharger le CV</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`${currentTheme.primary} p-1.5 sm:p-2 rounded-lg`}>
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">CV Creator Pro</span>
            </div>
            <p className="text-sm text-gray-500 text-center sm:text-right">
              Créez des CV professionnels • {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>

      {/* Overlay for theme picker on mobile */}
      {showThemePicker && (
        <div 
          className="fixed inset-0 bg-black/20 z-10 md:hidden"
          onClick={() => setShowThemePicker(false)}
        />
      )}
    </div>
  );
}