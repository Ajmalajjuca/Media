import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';

const LocationTracker = () => {
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mongoClient, setMongoClient] = useState(null);
  const [user, setUser] = useState(null);

  // MongoDB Atlas App Configuration
  const REALM_APP_ID = "myrealmapp-lwdulec"; // Your Realm App ID
  const DATABASE_NAME = "location_tracker";
  const COLLECTION_NAME = "locations";

  // Initialize Realm App
  const app = new Realm.App({ id: REALM_APP_ID });

  // Test function to verify authentication
  const testAuthentication = async () => {
    try {
      console.log('🧪 Testing authentication...');
      const testApp = new Realm.App({ id: REALM_APP_ID });
      const credentials = Realm.Credentials.anonymous();
      const user = await testApp.logIn(credentials);
      console.log('✅ Authentication test successful:', user.id);
      alert('✅ Authentication test successful!');
      return true;
    } catch (error) {
      console.error('❌ Authentication test failed:', error);
      alert('❌ Authentication test failed: ' + error.message);
      return false;
    }
  };

  // Test database access
  const testDatabaseAccess = async () => {
    try {
      if (!mongoClient) {
        console.error('❌ MongoDB client not initialized');
        alert('❌ MongoDB client not initialized');
        return;
      }

      console.log('🧪 Testing database access...');
      const collection = mongoClient.db(DATABASE_NAME).collection(COLLECTION_NAME);
      
      // Test read access
      console.log('🔍 Testing read access...');
      const readResult = await collection.find({});
      console.log('✅ Read access successful:', readResult.length, 'documents');
      
      // Test write access
      console.log('✏️ Testing write access...');
      const testDoc = {
        test: true,
        timestamp: new Date(),
        message: 'Test document',
        latitude: 0,
        longitude: 0,
        accuracy: 100
      };
      
      const writeResult = await collection.insertOne(testDoc);
      console.log('✅ Write access successful, ID:', writeResult.insertedId);
      
      // Clean up test document
      await collection.deleteOne({ _id: writeResult.insertedId });
      console.log('✅ Test document cleaned up');
      
      alert('✅ Database access test successful!');
    } catch (error) {
      console.error('❌ Database access test failed:', error);
      alert('❌ Database access test failed: ' + error.message);
    }
  };

  // Styles object (same as before)
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      padding: '40px',
      maxWidth: '600px',
      width: '100%',
      textAlign: 'center'
    },
    title: {
      color: '#333',
      marginBottom: '30px',
      fontSize: '2.5em',
      fontWeight: '300',
      margin: '0 0 30px 0'
    },
    statusBase: {
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '30px',
      fontSize: '1.1em',
      fontWeight: '500'
    },
    statusLoading: {
      background: '#e3f2fd',
      color: '#1976d2',
      border: '2px solid #bbdefb'
    },
    statusSuccess: {
      background: '#e8f5e8',
      color: '#2e7d32',
      border: '2px solid #c8e6c9'
    },
    statusError: {
      background: '#ffebee',
      color: '#c62828',
      border: '2px solid #ffcdd2'
    },
    statusWarning: {
      background: '#fff3e0',
      color: '#f57c00',
      border: '2px solid #ffcc02'
    },
    spinner: {
      border: '3px solid #f3f3f3',
      borderTop: '3px solid #667eea',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 20px'
    },
    locationInfo: {
      background: '#f8f9fa',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '30px',
      textAlign: 'left'
    },
    locationTitle: {
      color: '#333',
      marginBottom: '15px',
      fontSize: '1.3em',
      margin: '0 0 15px 0'
    },
    locationItem: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      padding: '8px 0',
      borderBottom: '1px solid #e0e0e0'
    },
    locationItemLast: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      padding: '8px 0',
      borderBottom: 'none'
    },
    locationLabel: {
      fontWeight: '600',
      color: '#666'
    },
    locationValue: {
      color: '#333'
    },
    button: {
      background: 'linear-gradient(45deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      padding: '12px 30px',
      borderRadius: '25px',
      fontSize: '1em',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginRight: '10px',
      marginBottom: '10px'
    },
    buttonDisabled: {
      background: '#ccc',
      cursor: 'not-allowed',
      transform: 'none'
    },
    history: {
      background: '#f8f9fa',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '30px',
      textAlign: 'left'
    },
    historyTitle: {
      color: '#333',
      marginBottom: '15px',
      fontSize: '1.3em',
      margin: '0 0 15px 0'
    },
    historyItem: {
      background: 'white',
      padding: '15px',
      marginBottom: '10px',
      borderRadius: '8px',
      borderLeft: '4px solid #667eea'
    },
    historyItemLast: {
      background: 'white',
      padding: '15px',
      marginBottom: '0',
      borderRadius: '8px',
      borderLeft: '4px solid #667eea'
    },
    timestamp: {
      fontSize: '0.9em',
      color: '#666',
      marginBottom: '5px'
    },
    coordinates: {
      fontFamily: 'monospace',
      fontSize: '0.9em',
      color: '#333'
    },
    noLocations: {
      color: '#666',
      fontStyle: 'italic',
      margin: '0'
    },
    dbStatus: {
      fontSize: '0.8em',
      color: '#666',
      marginTop: '10px'
    },
    setupInstructions: {
      background: '#f0f8ff',
      border: '1px solid #bee5eb',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '20px',
      fontSize: '0.9em',
      textAlign: 'left'
    }
  };

  // Initialize MongoDB connection
  const initializeMongoDB = async () => {
    try {
      console.log('🔄 Attempting to connect to Realm App:', REALM_APP_ID);
      
      // Check if already authenticated
      if (app.currentUser) {
        console.log('✅ Already authenticated as:', app.currentUser.id);
        setUser(app.currentUser);
        const mongodb = app.currentUser.mongoClient("mongodb-atlas");
        setMongoClient(mongodb);
        console.log('✅ MongoDB client initialized');
        return mongodb;
      }

      // Anonymous authentication
      console.log('🔄 Attempting anonymous authentication...');
      const credentials = Realm.Credentials.anonymous();
      const authenticatedUser = await app.logIn(credentials);
      console.log('✅ Anonymous authentication successful, User ID:', authenticatedUser.id);
      setUser(authenticatedUser);

      // Get MongoDB client
      const mongodb = authenticatedUser.mongoClient("mongodb-atlas");
      setMongoClient(mongodb);
      console.log('✅ MongoDB client initialized');

      console.log('✅ Connected to MongoDB Atlas via Realm');
      return mongodb;
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      
      // Provide specific error messages
      if (error.message.includes('401')) {
        throw new Error('Authentication failed. Please check: 1) Anonymous authentication is enabled in your Realm app, 2) You clicked "Deploy" after making changes, 3) Your App ID is correct');
      } else if (error.message.includes('404')) {
        throw new Error('Realm App not found. Please check your App ID: ' + REALM_APP_ID);
      } else if (error.message.includes('403')) {
        throw new Error('Access denied. Please check your authentication and database rules');
      } else {
        throw new Error('Connection failed: ' + error.message);
      }
    }
  };

  // Save location to MongoDB
  const saveLocationToMongoDB = async (location) => {
    try {
      if (!mongoClient) {
        throw new Error('MongoDB client not initialized');
      }

      const collection = mongoClient.db(DATABASE_NAME).collection(COLLECTION_NAME);
      
      const locationData = {
        ...location,
        timestamp: new Date(location.timestamp),
        createdAt: new Date()
      };

      // Use insertOne method for Realm Web SDK
      const result = await collection.insertOne(locationData);
      
      console.log('✅ Location saved to MongoDB:', result.insertedId);
      
      return {
        ...locationData,
        _id: result.insertedId
      };
    } catch (error) {
      console.error('❌ Error saving location to MongoDB:', error);
      
      // Check if it's a rules/permissions error
      if (error.message.includes('insert not permitted') || error.message.includes('403')) {
        throw new Error('Database write permission denied. Please check your Realm app Rules configuration.');
      }
      
      throw error;
    }
  };

  // Load locations from MongoDB
  const loadLocationsFromMongoDB = async () => {
    try {
      if (!mongoClient) {
        return [];
      }

      const collection = mongoClient.db(DATABASE_NAME).collection(COLLECTION_NAME);
      
      // Use aggregate for sorting and limiting in Realm Web SDK
      const locations = await collection.aggregate([
        { $sort: { timestamp: -1 } },
        { $limit: 50 }
      ]);

      console.log('✅ Loaded locations from MongoDB:', locations.length);
      return locations;
    } catch (error) {
      console.error('❌ Error loading locations from MongoDB:', error);
      
      // Try alternative method if aggregate fails
      try {
        const locations = await collection.find({});
        console.log('✅ Loaded locations from MongoDB (fallback):', locations.length);
        return locations.reverse(); // Sort newest first
      } catch (fallbackError) {
        console.error('❌ Fallback method also failed:', fallbackError);
        return [];
      }
    }
  };

  // Function to fetch current location
  const fetchLocation = async () => {
    setStatus('loading');
    setIsLoading(true);
    setCurrentLocation(null);

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMessage('Geolocation is not supported by this browser.');
      setIsLoading(false);
      return;
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed
        };

        try {
          if (mongoClient) {
            // Save to MongoDB
            const savedLocation = await saveLocationToMongoDB(location);
            
            // Update local state
            setLocations(prevLocations => [savedLocation, ...prevLocations]);
            setCurrentLocation(savedLocation);
            setStatus('success');
          } else {
            // If MongoDB not connected, just store locally
            setCurrentLocation(location);
            setStatus('warning');
            setErrorMessage('Location retrieved but not saved to MongoDB. Check your Atlas configuration.');
          }
        } catch (error) {
          // If MongoDB save fails, still show the location but with a warning
          setCurrentLocation(location);
          setStatus('error');
          setErrorMessage('Location retrieved but failed to save to MongoDB: ' + error.message);
        }
        
        setIsLoading(false);
      },
      (error) => {
        let errorMsg = 'Unable to retrieve your location. ';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg += 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg += 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMsg += 'Location request timed out.';
            break;
          default:
            errorMsg += 'An unknown error occurred.';
            break;
        }
        setStatus('error');
        setErrorMessage(errorMsg);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Starting app initialization...');
        
        // Initialize MongoDB connection
        await initializeMongoDB();
        
        // Load existing locations
        const savedLocations = await loadLocationsFromMongoDB();
        setLocations(savedLocations);
        
        // Fetch current location
        fetchLocation();
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setStatus('error');
        setErrorMessage(error.message);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Status component
  const StatusDisplay = () => {
    if (status === 'loading') {
      return (
        <div style={{...styles.statusBase, ...styles.statusLoading}}>
          <div style={styles.spinner}></div>
          Fetching your location...
        </div>
      );
    }
    
    if (status === 'success') {
      return (
        <div style={{...styles.statusBase, ...styles.statusSuccess}}>
          ✅ Location fetched and saved to MongoDB successfully!
        </div>
      );
    }
    
    if (status === 'warning') {
      return (
        <div style={{...styles.statusBase, ...styles.statusWarning}}>
          ⚠️ {errorMessage}
        </div>
      );
    }
    
    if (status === 'error') {
      return (
        <div style={{...styles.statusBase, ...styles.statusError}}>
          ❌ {errorMessage}
        </div>
      );
    }
  };

  // Setup instructions component
  const SetupInstructions = () => {
    if (mongoClient && status !== 'error') return null; // Hide if connected and no errors

    return (
      <div style={styles.setupInstructions}>
        <h4 style={{margin: '0 0 10px 0', color: '#0c5460'}}>
          🔧 Database Rules Configuration Required
        </h4>
        
        <div style={{marginBottom: '15px', color: '#d63384'}}>
          <strong>❌ 403 Error:</strong> Database write permissions not configured
        </div>
        
        <div style={{marginBottom: '15px', backgroundColor: '#fff3cd', padding: '10px', borderRadius: '5px'}}>
          <strong>Configure Rules Step-by-Step:</strong>
          <ol style={{margin: '5px 0', paddingLeft: '20px', fontSize: '0.9em'}}>
            <li>Go to your Realm app → <strong>"Rules"</strong></li>
            <li>Look for <strong>"Default Rules"</strong> or <strong>"Configure Collection Rules"</strong></li>
            <li>Set <strong>Default Rules</strong> to:
              <div style={{margin: '5px 0', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '3px', fontFamily: 'monospace', fontSize: '0.85em'}}>
                Read: {'{}'}<br/>
                Write: {'{}'}<br/>
                Delete: {'{}'}
              </div>
            </li>
            <li>Make sure <strong>"Apply to all collections"</strong> is checked</li>
            <li><strong>Click "Save Draft" then "Deploy"</strong></li>
          </ol>
        </div>
        
        <div style={{marginBottom: '15px', backgroundColor: '#e3f2fd', padding: '10px', borderRadius: '5px'}}>
          <strong>Alternative - Create Specific Rules:</strong>
          <ol style={{margin: '5px 0', paddingLeft: '20px', fontSize: '0.9em'}}>
            <li>In <strong>"Rules"</strong>, click <strong>"Add Database"</strong></li>
            <li>Select your cluster and create database: <strong>"location_tracker"</strong></li>
            <li>Add collection: <strong>"locations"</strong></li>
            <li>Set the same rules as above</li>
            <li><strong>Save Draft and Deploy</strong></li>
          </ol>
        </div>
        
        <div style={{marginTop: '15px'}}>
          <button 
            onClick={testDatabaseAccess}
            style={{...styles.button, fontSize: '0.9em', padding: '8px 16px', marginRight: '10px'}}
          >
            🧪 Test Database Access
          </button>
          <a 
            href={`https://realm.mongodb.com/groups/${REALM_APP_ID.split('-')[0]}/apps/${REALM_APP_ID}/rules`}
            target="_blank" 
            rel="noopener noreferrer"
            style={{...styles.button, textDecoration: 'none', display: 'inline-block', fontSize: '0.9em', padding: '8px 16px'}}
          >
            🔧 Open Rules Settings
          </a>
        </div>
        
        <div style={{marginTop: '15px', padding: '10px', backgroundColor: '#d1ecf1', borderRadius: '4px', fontSize: '0.85em'}}>
          <strong>💡 What to look for in Rules:</strong><br/>
          • "Default Rules" section<br/>
          • "Configure Collection Rules" button<br/>
          • "Templates" with pre-made rules<br/>
          • Make sure to click "Deploy" after any changes!
        </div>
      </div>
    );
  };

  // Location info component
  const LocationInfo = ({ location }) => {
    if (!location) return null;

    return (
      <div style={styles.locationInfo}>
        <h3 style={styles.locationTitle}>Current Location</h3>
        <div>
          <div style={styles.locationItem}>
            <span style={styles.locationLabel}>Latitude:</span>
            <span style={styles.locationValue}>{location.latitude.toFixed(6)}</span>
          </div>
          <div style={styles.locationItem}>
            <span style={styles.locationLabel}>Longitude:</span>
            <span style={styles.locationValue}>{location.longitude.toFixed(6)}</span>
          </div>
          <div style={styles.locationItem}>
            <span style={styles.locationLabel}>Accuracy:</span>
            <span style={styles.locationValue}>{location.accuracy.toFixed(0)} meters</span>
          </div>
          <div style={location.altitude || location.speed ? styles.locationItem : styles.locationItemLast}>
            <span style={styles.locationLabel}>Timestamp:</span>
            <span style={styles.locationValue}>{new Date(location.timestamp).toLocaleString()}</span>
          </div>
          {location.altitude && (
            <div style={location.speed ? styles.locationItem : styles.locationItemLast}>
              <span style={styles.locationLabel}>Altitude:</span>
              <span style={styles.locationValue}>{location.altitude.toFixed(2)} meters</span>
            </div>
          )}
          {location.speed && (
            <div style={styles.locationItemLast}>
              <span style={styles.locationLabel}>Speed:</span>
              <span style={styles.locationValue}>{location.speed.toFixed(2)} m/s</span>
            </div>
          )}
        </div>
        {location._id && (
          <div style={styles.dbStatus}>
            MongoDB ID: {location._id.toString()}
          </div>
        )}
      </div>
    );
  };

  // Location history component
  const LocationHistory = () => {
    return (
      <div style={styles.history}>
        <h3 style={styles.historyTitle}>Location History (MongoDB Atlas)</h3>
        <div>
          {locations.length === 0 ? (
            <p style={styles.noLocations}>No locations recorded yet.</p>
          ) : (
            locations.map((location, index) => (
              <div key={location._id?.toString() || index} style={index === locations.length - 1 ? styles.historyItemLast : styles.historyItem}>
                <div style={styles.timestamp}>
                  {new Date(location.timestamp).toLocaleString()}
                </div>
                <div style={styles.coordinates}>
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  <span style={{color: '#666', marginLeft: '10px'}}>±{location.accuracy.toFixed(0)}m</span>
                </div>
                {location._id && (
                  <div style={{fontSize: '0.8em', color: '#999', marginTop: '5px'}}>
                    ID: {location._id.toString()}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const handleButtonHover = (e) => {
    if (!isLoading) {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
    }
  };

  const handleButtonLeave = (e) => {
    if (!isLoading) {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = 'none';
    }
  };

  const refreshLocations = async () => {
    const savedLocations = await loadLocationsFromMongoDB();
    setLocations(savedLocations);
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
        `}
      </style>
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>📍 Location Tracker</h1>
          <div style={styles.dbStatus}>
            {mongoClient ? '✅ Connected to MongoDB Atlas' : '❌ Not connected to MongoDB'}
          </div>
          
          <SetupInstructions />
          
          <StatusDisplay />
          
          <LocationInfo location={currentLocation} />
          
          <div>
            <button
              onClick={fetchLocation}
              disabled={isLoading}
              style={isLoading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
            >
              🔄 {isLoading ? 'Fetching...' : 'Get New Location'}
            </button>
            
            <button
              onClick={refreshLocations}
              disabled={isLoading || !mongoClient}
              style={(isLoading || !mongoClient) ? {...styles.button, ...styles.buttonDisabled} : styles.button}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
            >
              📋 Refresh History
            </button>
          </div>
          
          <LocationHistory />
        </div>
      </div>
    </>
  );
};

export default LocationTracker;