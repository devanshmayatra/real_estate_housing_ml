import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Box, Card, CardContent, Typography, Button,
  TextField, MenuItem, CircularProgress, Chip, Stack, Divider, Paper
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Leaflet Imports
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet Icon
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- TYPES ---
interface FormData {
  Rooms: number;
  Distance: number;
  Bathroom: number;
  Car: number;
  Landsize: number;
  BuildingArea: number;
  YearBuilt: number;
  Lattitude: number;
  Longtitude: number;
  Regionname: string;
}

interface PredictionResponse {
  predicted_price: number;
  tier: string;
  cluster_id: number;
}

// --- MAP COMPONENTS ---
const LocationPicker = ({ setFormData }: { setFormData: React.Dispatch<React.SetStateAction<FormData>> }) => {
  useMapEvents({
    click(e) {
      setFormData((prev) => ({
        ...prev,
        Lattitude: parseFloat(e.latlng.lat.toFixed(4)),
        Longtitude: parseFloat(e.latlng.lng.toFixed(4))
      }));
    },
  });
  return null;
};

const RecenterAutomatically = ({ lat, lon }: { lat: number; lon: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon]);
  }, [lat, lon, map]);
  return null;
};

// --- MAIN APP ---
const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    Rooms: 3, Distance: 5.0, Bathroom: 1, Car: 1,
    Landsize: 400, BuildingArea: 150, YearBuilt: 1990,
    Lattitude: -37.81, Longtitude: 144.96, Regionname: "Region_0"
  });
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post<PredictionResponse>('http://127.0.0.1:10000/predict', formData);
      setPrediction(response.data);
    } catch (error) {
      console.error(error);
      alert("API Error: Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width:'99vw',bgcolor: '#f8f9fa', minHeight: '90vh', py: 5 }}>

      {/* HEADER */}
      <Container maxWidth="xl" sx={{ mb: 5, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="800" sx={{ color: '#2c3e50', letterSpacing: '-1px' }}>
          🏙️ Real Estate Titan
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#7f8c8d', mt: 1 }}>
          Professional AI Valuation System
        </Typography>
      </Container>

      {/* MAIN LAYOUT: Side-by-Side on Desktop, Stacked on Mobile */}
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // <--- THE MAGIC LINE
          alignItems: 'flex-start',
          gap: 4
        }}
      >

        {/* --- LEFT COLUMN (FORM) --- */}
        <Box sx={{ width: { xs: '100%', md: '40%' } }}> {/* 40% Width */}
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <HomeIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">Property Details</Typography>
                </Box>

                <Stack direction="row" spacing={2}>
                  <TextField fullWidth label="Rooms" name="Rooms" type="number" value={formData.Rooms} onChange={handleChange} size="small" />
                  <TextField fullWidth label="Baths" name="Bathroom" type="number" value={formData.Bathroom} onChange={handleChange} size="small" />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <TextField fullWidth label="Cars" name="Car" type="number" value={formData.Car} onChange={handleChange} size="small" />
                  <TextField fullWidth label="Year" name="YearBuilt" type="number" value={formData.YearBuilt} onChange={handleChange} size="small" />
                </Stack>

                <TextField select fullWidth label="Region" name="Regionname" value={formData.Regionname} onChange={handleChange} size="small">
                  <MenuItem value="Region_0">Region 0 (Inner City)</MenuItem>
                  <MenuItem value="Region_1">Region 1 (Northern Suburbs)</MenuItem>
                  <MenuItem value="Region_2">Region 2 (Western Suburbs)</MenuItem>
                </TextField>

                <Stack direction="row" spacing={2}>
                  <TextField fullWidth label="Land (sqm)" name="Landsize" type="number" value={formData.Landsize} onChange={handleChange} size="small" />
                  <TextField fullWidth label="Build (sqm)" name="BuildingArea" type="number" value={formData.BuildingArea} onChange={handleChange} size="small" />
                </Stack>

                <Divider sx={{ my: 1 }}>
                  <Chip label="Location Coordinates" size="small" />
                </Divider>

                <Stack direction="row" spacing={2}>
                  <TextField fullWidth label="Lat" name="Lattitude" type="number" value={formData.Lattitude} disabled size="small" />
                  <TextField fullWidth label="Lon" name="Longtitude" type="number" value={formData.Longtitude} disabled size="small" />
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    backgroundColor: '#2c3e50',
                    '&:hover': { backgroundColor: '#34495e' }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Run AI Prediction"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* --- RIGHT COLUMN (MAP & RESULTS) --- */}
        <Box sx={{ width: { xs: '100%', md: '60%' }, display: 'flex', flexDirection: 'column', gap: 3 }}> {/* 60% Width */}

          {/* MAP */}
          <Paper elevation={0} sx={{ height: prediction ? 300 : 535, borderRadius: 3, overflow: 'hidden', border: '1px solid #e0e0e0', position: 'relative' }}>
            <MapContainer center={[formData.Lattitude, formData.Longtitude]} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="OpenStreetMap" />
              <Marker position={[formData.Lattitude, formData.Longtitude]} />
              <LocationPicker setFormData={setFormData} />
              <RecenterAutomatically lat={formData.Lattitude} lon={formData.Longtitude} />
            </MapContainer>

            <Box sx={{ position: 'absolute', bottom: 16, left: 16, zIndex: 1000, bgcolor: 'white', px: 2, py: 0.5, borderRadius: 10, boxShadow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon fontSize="small" color="error" />
              <Typography variant="caption" fontWeight="bold">Click map to set location</Typography>
            </Box>
          </Paper>

          {/* RESULTS CARD (Only appears after prediction) */}
          {prediction && (
            <Card elevation={0} sx={{height:'200px', bgcolor: '#27ae60', color: 'white', borderRadius: 3, overflow: 'visible', position: 'relative', boxShadow: 3 }}>
              <CardContent sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="overline" sx={{ opacity: 0.9, letterSpacing: 1, fontSize: '0.9rem' }}>Estimated Market Value</Typography>
                <Typography variant="h2" fontWeight="800" sx={{ my: 1, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  ${prediction.predicted_price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Typography>

                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                  <Chip
                    icon={<AttachMoneyIcon style={{ color: '#2c3e50' }} />}
                    label={prediction.tier}
                    sx={{ bgcolor: 'white', color: '#2c3e50', fontWeight: 'bold', fontSize: '1rem', px: 1 }}
                  />
                  <Chip
                    icon={<MapIcon style={{ color: 'white' }} />}
                    label={`Cluster #${prediction.cluster_id}`}
                    variant="outlined"
                    sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', fontSize: '1rem', px: 1 }}
                  />
                </Stack>
              </CardContent>
            </Card>
          )}

        </Box>
      </Container>
    </Box>
  );
}

export default App;