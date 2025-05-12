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
  ArrowForward as ArrowForwardIcon,
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

const IntroContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  height: '100vh',
  width: '100%',
  maxWidth: '100%',
  background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
  color: 'white',
  padding: '2rem',
  boxSizing: 'border-box',
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

const ActionButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(90deg, #ffffff 0%, #e3f2fd 100%)',
  color: '#1976d2',
  fontWeight: 'bold',
  padding: '12px 24px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  margin: '20px 0',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'white',
    boxShadow: '0 6px 14px rgba(0,0,0,0.15)',
    transform: 'translateY(-2px)',
  },
}));

// Introduction Page Component
const IntroPage = ({ navigateToApp }) => {
  return (
    <IntroContainer>
      <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        Đánh Giá CV Ứng Viên
      </Typography>
      <Typography variant="h5" sx={{ mb: 3, maxWidth: '700px' }}>
        Hệ thống đánh giá CV tự động sử dụng AI để phân tích CV của bạn và đánh giá mức độ phù hợp với mô tả công việc.
      </Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Dịch vụ này giúp bạn:
      </Typography>
      <List sx={{ mb: 4, maxWidth: '600px' }}>
        <ListItem>
          <ListItemIcon>
            <CheckIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Trích xuất thông tin từ CV" primaryTypographyProps={{ color: 'white' }} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Phát hiện thông tin còn thiếu" primaryTypographyProps={{ color: 'white' }} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Đánh giá mức độ phù hợp với công việc" primaryTypographyProps={{ color: 'white' }} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Nhận phản hồi chi tiết và lý do đánh giá" primaryTypographyProps={{ color: 'white' }} />
        </ListItem>
      </List>
      <ActionButton 
        variant="contained" 
        size="large" 
        endIcon={<ArrowForwardIcon />}
        onClick={navigateToApp}
      >
        Sử dụng ngay
      </ActionButton>
    </IntroContainer>
  );
};

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [feature, setFeature] = useState('cv-info');
  const [jobDescription, setJobDescription] = useState('');
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [jobDescriptionType, setJobDescriptionType] = useState('text'); // 'text' or 'file'
  const [currentPage, setCurrentPage] = useState('intro'); // 'intro' or 'app'

  // Handle navigation from intro to app
  const navigateToApp = () => {
    window.history.pushState({}, '', window.location.pathname + '#/work');
    setCurrentPage('app');
  };

  // Check for URL path on load
  useEffect(() => {
    if (window.location.hash === '#/work') {
      setCurrentPage('app');
    }

    // Listen for hash changes
    const handleHashChange = () => {
      if (window.location.hash === '#/work') {
        setCurrentPage('app');
      } else {
        setCurrentPage('intro');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
      
      // Use proxy if not in production or if it's a different domain to avoid CORS issues
      let apiUrl = `${apiBaseUrl}/${endpoint}`;
      const currentDomain = window.location.hostname;
      const apiDomain = new URL(apiBaseUrl).hostname;
      
      // If we're on a different domain, try to use CORS proxy for development
      if (currentDomain !== apiDomain && process.env.NODE_ENV !== 'production') {
        apiUrl = `/api/${endpoint}`; // This assumes you've set up a proxy in your development server
      }

      // For demo purposes, if the API is unavailable, use mock data
      const shouldUseMockData = window.APP_CONFIG?.DEMO_MODE === true;
      
      if (shouldUseMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate mock data based on the feature
        let mockData;
        if (feature === 'cv-info') {
          mockData = {
            cv_info: {
              name: "Nguyễn Văn A",
              email: "nguyenvana@email.com",
              phone: "0912345678",
              education: [
                "Đại học Bách Khoa Hà Nội - Kỹ sư Công nghệ thông tin (2015-2019)"
              ],
              experience: [
                "Công ty ABC - Lập trình viên Frontend (2019-2021)",
                "Công ty XYZ - Lập trình viên Fullstack (2021-hiện tại)"
              ],
              skills: [
                "JavaScript", "React", "Node.js", "HTML/CSS", "SQL"
              ]
            },
            missing_fields: [
              "Địa chỉ", "Dự án", "Chứng chỉ"
            ]
          };
        } else {
          mockData = {
            compatibility_score: 85,
            reasons: [
              "Ứng viên có kỹ năng phù hợp với yêu cầu công việc",
              "Kinh nghiệm trong lĩnh vực phát triển web",
              "Thiếu kinh nghiệm làm việc với Docker và Kubernetes",
              "Phù hợp về mặt học vấn và chuyên môn"
            ]
          };
        }
        
        setResult(mockData);
        return;
      }
      
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
          // Add credentials to allow cookies if needed
          credentials: 'include',
          // Set longer timeout
          signal: AbortSignal.timeout(30000) // 30 seconds timeout
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
      } catch (fetchError) {
        console.error('Fetch Error:', fetchError);
        
        // Fallback to mock data if fetch fails
        if (feature === 'cv-info') {
          setResult({
            cv_info: {
              name: file.name.split('.')[0],
              email: "example@gmail.com",
              phone: "09xxxxxxxx",
              education: [
                "Đã trích xuất được CV nhưng gặp lỗi kết nối máy chủ"
              ],
              experience: [
                "Không thể kết nối đến máy chủ phân tích"
              ],
              skills: [
                "JavaScript", "Và các kỹ năng khác (dữ liệu mẫu)"
              ]
            },
            missing_fields: [
              "Lỗi kết nối - Không thể phân tích đầy đủ"
            ]
          });
        } else {
          setResult({
            compatibility_score: 50,
            reasons: [
              "Lỗi kết nối - Không thể phân tích đầy đủ",
              "Đây là dữ liệu mẫu do không thể kết nối đến máy chủ",
              "Vui lòng thử lại sau hoặc liên hệ hỗ trợ kỹ thuật"
            ]
          });
        }
      }
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
    if (currentPage === 'app') {
      document.body.style.backgroundImage = "url('https://tdconsulting.vn/wp-content/themes/tdconsulting/images/bg-home.jpg')";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundRepeat = "no-repeat";
    } else {
      document.body.style.backgroundImage = "none";
      document.body.style.backgroundColor = "#42a5f5";
    }
    
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
  }, [currentPage]);

  // Render the appropriate page based on currentPage state
  if (currentPage === 'intro') {
    return <IntroPage navigateToApp={navigateToApp} />;
  }

  // Main App UI
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