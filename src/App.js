import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Rating,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Lightbulb as SuggestionIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  StarHalf as StarHalfIcon,
  Description as DescriptionIcon,
  Work as WorkIcon,
} from '@mui/icons-material';

// Determine the public URL based on where the app is running
const getPublicUrl = () => {
  // GitHub Pages or custom domain deployment
  if (window.location.hostname.includes('github.io') || 
      window.location.hostname.includes('huygoodboy.io.vn')) {
    return '.';
  }
  
  // Local development
  return process.env.PUBLIC_URL || '';
};

// Modern friendly styles
const GradientBg = styled('div')(() => ({
  minHeight: '100vh',
  width: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  background: 'linear-gradient(90deg, #e0f7fa 0%, #e3f0ff 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
}));

const CenteredContainer = styled(Container)(({ theme }) => ({
  background: 'rgba(255,255,255,0.95)',
  borderRadius: 24,
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  padding: theme.spacing(4),
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(6),
  maxWidth: 900,
  width: '100%',
  overflowX: 'hidden',
}));

const UploadBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  border: `2px dashed #90caf9`,
  backgroundColor: '#f8fafd',
  cursor: 'pointer',
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(33,150,243,0.07)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#e3f2fd',
    borderColor: '#42a5f5',
  },
}));

const ResultCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(3),
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 8px rgba(33,150,243,0.10)',
  borderRadius: '16px',
}));

const ScoreBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  marginBottom: theme.spacing(2),
}));

const CustomChip = styled(Chip)(({ theme, type }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: type === 'error' ? '#ffebee' : '#e3f2fd',
  color: type === 'error' ? '#c62828' : '#1565c0',
  '& .MuiChip-icon': {
    color: 'inherit',
  },
}));

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [feature, setFeature] = useState('cv-info');
  const [jobDescription, setJobDescription] = useState('');
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [jobDescriptionType, setJobDescriptionType] = useState('text'); // 'text' or 'file'

  const handleFeatureChange = (event, newFeature) => {
    if (newFeature !== null) {
      setFeature(newFeature);
      setResult(null);
      setError('');
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError('');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleJobDescriptionFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setJobDescriptionFile(selectedFile);
      setError('');
    }
  };

  const handleJobDescriptionTypeChange = (event, newType) => {
    if (newType !== null) {
      setJobDescriptionType(newType);
      setJobDescription('');
      setJobDescriptionFile(null);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Vui lòng chọn file CV');
      return;
    }
    if (feature === 'job-compatibility') {
      if (jobDescriptionType === 'text' && !jobDescription.trim()) {
        setError('Vui lòng nhập mô tả công việc');
        return;
      }
      if (jobDescriptionType === 'file' && !jobDescriptionFile) {
        setError('Vui lòng chọn file mô tả công việc');
        return;
      }
    }
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    if (feature === 'job-compatibility') {
      if (jobDescriptionType === 'text') {
        formData.append('job_description', jobDescription.trim());
      } else {
        formData.append('job_description_file', jobDescriptionFile);
      }
    }
    try {
      const endpoint = feature === 'cv-info' ? 'evaluate-cv' : 'evaluate-job-compatibility';
      
      // Determine the correct API URL
      let apiBaseUrl;
      if (window.APP_CONFIG && window.APP_CONFIG.API_URL) {
        apiBaseUrl = window.APP_CONFIG.API_URL;
      } else if (window.API_URL) {
        apiBaseUrl = window.API_URL;
      } else if (process.env.REACT_APP_API_URL) {
        apiBaseUrl = process.env.REACT_APP_API_URL;
      } else {
        // Default API URL
        apiBaseUrl = 'https://cv.tdconsulting.vn';
      }
      
      // Remove trailing slash if present
      apiBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
      
      console.log(`Connecting to API at: ${apiBaseUrl}/${endpoint}`);
      
      const response = await fetch(`${apiBaseUrl}/${endpoint}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || `Lỗi khi xử lý yêu cầu (${response.status})`;
        } catch (e) {
          errorMessage = `Lỗi kết nối đến máy chủ (${response.status})`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    if (feature === 'cv-info') {
      return (
        <ResultCard>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
              Thông tin CV
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(result.cv_info).map(([key, value]) => {
                if (Array.isArray(value)) {
                  return (
                    <Grid item xs={12} key={key}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#424242' }}>
                        {key.replace(/_/g, ' ').toUpperCase()}:
                      </Typography>
                      <List dense>
                        {value.map((item, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <CheckIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                typeof item === 'object' && item !== null
                                  ? Object.entries(item).map(([k, v]) => `${k}: ${v}`).join(' | ')
                                  : String(item)
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  );
                } else if (typeof value === 'object' && value !== null) {
                  return (
                    <Grid item xs={12} sm={6} key={key}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#424242' }}>
                        {key.replace(/_/g, ' ').toUpperCase()}:
                      </Typography>
                      <Typography variant="body1">
                        {Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                      </Typography>
                    </Grid>
                  );
                }
                return (
                  <Grid item xs={12} sm={6} key={key}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#424242' }}>
                      {key.replace(/_/g, ' ').toUpperCase()}:
                    </Typography>
                    <Typography variant="body1">{String(value)}</Typography>
                  </Grid>
                );
              })}
            </Grid>

            {result.missing_fields.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ color: '#c62828' }}>
                  <ErrorIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Thông tin còn thiếu
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {result.missing_fields.map((field, index) => (
                    <CustomChip
                      key={index}
                      label={field}
                      icon={<ErrorIcon />}
                      type="error"
                    />
                  ))}
                </Box>
              </>
            )}
          </CardContent>
        </ResultCard>
      );
    } else {
      return (
        <ResultCard>
          <CardContent>
            <ScoreBox>
              <Typography variant="h4" component="div" sx={{ color: '#1a237e', fontWeight: 'bold' }}>
                {result.compatibility_score}%
              </Typography>
            </ScoreBox>

            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
              Lý do đánh giá
            </Typography>
            <List>
              {result.reasons.map((reason, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <SuggestionIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={reason} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </ResultCard>
      );
    }
  };

  // Set background image for the whole page
  useEffect(() => {
    document.body.style.backgroundImage = "url('https://tdconsulting.vn/wp-content/themes/tdconsulting/images/bg-home.jpg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.minHeight = "100vh";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "auto";
    document.body.style.width = "100%";
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.minHeight = '';
      document.body.style.backgroundColor = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
    };
  }, []);

  return (
    <GradientBg>
      <CenteredContainer>
        <Typography variant="h3" component="h1" align="center" sx={{
          color: '#1976d2',
          fontWeight: 'bold',
          mb: 2,
          letterSpacing: 1.5,
        }}>
          Đánh Giá CV Ứng Viên
        </Typography>
        <Typography align="center" sx={{ color: '#424242', mb: 4, fontSize: 18 }}>
          Hệ thống hỗ trợ đánh giá CV và mức độ phù hợp với mô tả công việc một cách nhanh chóng, thân thiện và chính xác.
        </Typography>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup
            value={feature}
            exclusive
            onChange={handleFeatureChange}
            aria-label="feature selection"
          >
            <ToggleButton value="cv-info" aria-label="cv information">
              <DescriptionIcon sx={{ mr: 1 }} />
              Đánh giá CV
            </ToggleButton>
            <ToggleButton value="job-compatibility" aria-label="job compatibility">
              <WorkIcon sx={{ mr: 1 }} />
              Đánh giá phù hợp công việc
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Grid container spacing={4} alignItems="flex-start" sx={{ width: '100%', mx: 0 }}>
          <Grid item xs={12} sm={12} md={6}>
            <UploadBox
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input
                type="file"
                id="fileInput"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <UploadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Kéo thả hoặc click để chọn file CV
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Hỗ trợ file PDF, DOC, DOCX
              </Typography>
              {file && (
                <Typography variant="body2" sx={{ mt: 2, color: '#1976d2' }}>
                  Đã chọn: {file.name}
                </Typography>
              )}
            </UploadBox>
            {feature === 'job-compatibility' && (
              <>
                <Box sx={{ mt: 3, mb: 2, textAlign: 'center' }}>
                  <ToggleButtonGroup
                    value={jobDescriptionType}
                    exclusive
                    onChange={handleJobDescriptionTypeChange}
                    aria-label="job description type"
                    size="small"
                  >
                    <ToggleButton value="text" aria-label="text input">
                      Nhập mô tả công việc
                    </ToggleButton>
                    <ToggleButton value="file" aria-label="file upload">
                      Upload file mô tả
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                {jobDescriptionType === 'text' ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Mô tả công việc"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    sx={{ mt: 2, borderRadius: 2, background: '#f8fafd' }}
                  />
                ) : (
                  <UploadBox
                    onClick={() => document.getElementById('jobDescriptionFileInput').click()}
                    sx={{ mt: 2 }}
                  >
                    <input
                      type="file"
                      id="jobDescriptionFileInput"
                      accept=".pdf"
                      onChange={handleJobDescriptionFileChange}
                      style={{ display: 'none' }}
                    />
                    <UploadIcon sx={{ fontSize: 40, color: '#1976d2', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Kéo thả hoặc click để chọn file mô tả công việc
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Hỗ trợ file PDF
                    </Typography>
                    {jobDescriptionFile && (
                      <Typography variant="body2" sx={{ mt: 2, color: '#1976d2' }}>
                        Đã chọn: {jobDescriptionFile.name}
                      </Typography>
                    )}
                  </UploadBox>
                )}
              </>
            )}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!file || loading}
                sx={{
                  background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 18,
                  px: 5,
                  py: 1.5,
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(33,150,243,0.10)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Xử lý'}
              </Button>
            </Box>
            {error && (
              <Typography color="error" sx={{ mt: 2, textAlign: 'center', fontWeight: 500 }}>
                {error}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Paper sx={{ p: 3, background: 'rgba(232,245,253,0.7)', borderRadius: 4, boxShadow: '0 2px 8px rgba(33,150,243,0.07)' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                Hướng dẫn sử dụng
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Chọn file CV của bạn (PDF, DOC, DOCX)" />
                </ListItem>
                {feature === 'job-compatibility' && (
                  <ListItem>
                    <ListItemIcon>
                      <CheckIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Nhập hoặc upload mô tả công việc" />
                  </ListItem>
                )}
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Nhấn nút 'Xử lý' để nhận kết quả đánh giá" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
        {renderResult()}
      </CenteredContainer>
    </GradientBg>
  );
}

export default App; 