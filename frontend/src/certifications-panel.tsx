import React, { useState, useEffect } from 'react';
import { CheckCircle, Award, BookOpen, Clock, ArrowRight, ArrowLeft, Trophy } from 'lucide-react';

const CertificationExamApp = () => {
  const [currentView, setCurrentView] = useState('certifications'); // 'certifications', 'exam', 'results'
  const [certifications, setCertifications] = useState([]);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [examResults, setExamResults] = useState(null);
  const [employeeId] = useState(1); // Mock employee ID

  // Mock API base URL - replace with your actual API endpoint
  const API_BASE = 'http://localhost:8000/api';

  // Mock API functions (replace with actual API calls)
  const mockAPI = {
    getCertifications: async () => {
      // Mock data based on your backend structure
      return [
        {
          id: 1,
          name: "AWS Cloud Practitioner",
          description: "Foundational cloud computing certification",
          resources: ["AWS Documentation", "Practice Tests", "Video Tutorials"]
        },
        {
          id: 2,
          name: "Python Developer",
          description: "Professional Python programming certification",
          resources: ["Python.org Docs", "Coding Exercises", "Project Examples"]
        },
        {
          id: 3,
          name: "Data Analytics",
          description: "Data analysis and visualization certification",
          resources: ["Statistics Guide", "SQL Tutorials", "Visualization Tools"]
        }
      ];
    },
    
    getExam: async (certificationId) => {
      return {
        id: 1,
        certification_id: certificationId,
        questions: [1, 2, 3, 4, 5]
      };
    },
    
    getExamQuestions: async (examId) => {
      const mockQuestions = [
        {
          id: 1,
          exam_id: examId,
          question_text: "What is the main benefit of cloud computing?",
          correct_answer: "Scalability and cost-effectiveness",
          options: [
            "Scalability and cost-effectiveness",
            "Better security than on-premise",
            "Faster processing speeds",
            "Easier to manage than physical servers"
          ]
        },
        {
          id: 2,
          exam_id: examId,
          question_text: "Which AWS service is used for object storage?",
          correct_answer: "Amazon S3",
          options: [
            "Amazon EC2",
            "Amazon S3",
            "Amazon RDS",
            "Amazon Lambda"
          ]
        },
        {
          id: 3,
          exam_id: examId,
          question_text: "What does EC2 stand for?",
          correct_answer: "Elastic Compute Cloud",
          options: [
            "Electronic Commerce Cloud",
            "Elastic Compute Cloud",
            "Enhanced Computing Cluster",
            "Enterprise Cloud Computing"
          ]
        },
        {
          id: 4,
          exam_id: examId,
          question_text: "Which service provides DNS web service?",
          correct_answer: "Route 53",
          options: [
            "CloudFront",
            "Route 53",
            "API Gateway",
            "Load Balancer"
          ]
        },
        {
          id: 5,
          exam_id: examId,
          question_text: "What is the AWS free tier?",
          correct_answer: "Free usage limits for new AWS customers",
          options: [
            "A premium support plan",
            "Free usage limits for new AWS customers",
            "Unlimited free services for students",
            "Free training and certification programs"
          ]
        }
      ];
      return mockQuestions;
    },
    
    awardBadge: async (employeeId, certificationId) => {
      return {
        id: Date.now(),
        employee_id: employeeId,
        certification_id: certificationId,
        date_earned: new Date().toISOString()
      };
    }
  };

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    setLoading(true);
    try {
      const data = await mockAPI.getCertifications();
      setCertifications(data);
    } catch (err) {
      setError('Failed to load certifications');
    }
    setLoading(false);
  };

  const startExam = async (certification) => {
    setLoading(true);
    setSelectedCertification(certification);
    try {
      const examData = await mockAPI.getExam(certification.id);
      setExam(examData);
      
      const questionsData = await mockAPI.getExamQuestions(examData.id);
      setQuestions(questionsData);
      
      setCurrentView('exam');
      setCurrentQuestionIndex(0);
      setAnswers({});
    } catch (err) {
      setError('Failed to load exam');
    }
    setLoading(false);
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitExam = async () => {
    setLoading(true);
    
    // Calculate results
    let correctAnswers = 0;
    const totalQuestions = questions.length;
    
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correct_answer) {
        correctAnswers++;
      }
    });
    
    const percentage = (correctAnswers / totalQuestions) * 100;
    const passed = percentage >= 70; // 70% passing grade
    
    const results = {
      correctAnswers,
      totalQuestions,
      percentage: Math.round(percentage),
      passed,
      certification: selectedCertification
    };
    
    setExamResults(results);
    
    // Award badge if passed
    if (passed) {
      try {
        await mockAPI.awardBadge(employeeId, selectedCertification.id);
      } catch (err) {
        console.error('Failed to award badge:', err);
      }
    }
    
    setCurrentView('results');
    setLoading(false);
  };

  const resetExam = () => {
    setCurrentView('certifications');
    setSelectedCertification(null);
    setExam(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setExamResults(null);
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Certification Hub</h1>
            </div>
            {currentView !== 'certifications' && (
              <button
                onClick={resetExam}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Back to Certifications
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Certifications View */}
        {currentView === 'certifications' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Certifications</h2>
              <p className="text-gray-600">Choose a certification to begin your exam</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert) => (
                <div key={cert.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                  <div className="flex items-center mb-4">
                    <BookOpen className="h-8 w-8 text-indigo-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">{cert.name}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{cert.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Resources:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {cert.resources.map((resource, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    onClick={() => startExam(cert)}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                  >
                    Start Exam
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exam View */}
        {currentView === 'exam' && questions.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">{selectedCertification?.name}</h2>
                  <span className="text-sm text-gray-500">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <Clock className="h-5 w-5 text-indigo-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    {questions[currentQuestionIndex]?.question_text}
                  </h3>
                </div>
                
                {/* Multiple Choice Options */}
                <div className="space-y-3">
                  {questions[currentQuestionIndex]?.options?.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                        answers[questions[currentQuestionIndex]?.id] === option
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${questions[currentQuestionIndex]?.id}`}
                        value={option}
                        checked={answers[questions[currentQuestionIndex]?.id] === option}
                        onChange={(e) => handleAnswerChange(questions[currentQuestionIndex]?.id, e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 ${
                        answers[questions[currentQuestionIndex]?.id] === option
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-gray-300'
                      }`}>
                        {answers[questions[currentQuestionIndex]?.id] === option && (
                          <div className="w-2 h-2 rounded-full bg-white m-0.5"></div>
                        )}
                      </div>
                      <span className="text-gray-700 flex-1">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </button>
                
                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={submitExam}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Submit Exam
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results View */}
        {currentView === 'results' && examResults && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-6">
                {examResults.passed ? (
                  <div className="text-green-600">
                    <Trophy className="h-16 w-16 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
                    <p className="text-lg">You passed the {examResults.certification.name} exam!</p>
                  </div>
                ) : (
                  <div className="text-red-600">
                    <div className="h-16 w-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📚</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Keep Learning!</h2>
                    <p className="text-lg">You need more practice for the {examResults.certification.name} exam.</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-gray-900">{examResults.correctAnswers}</p>
                  <p className="text-sm text-gray-600">Correct Answers</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-gray-900">{examResults.totalQuestions}</p>
                  <p className="text-sm text-gray-600">Total Questions</p>
                </div>
                <div className={`rounded-lg p-4 ${examResults.passed ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className={`text-2xl font-bold ${examResults.passed ? 'text-green-700' : 'text-red-700'}`}>
                    {examResults.percentage}%
                  </p>
                  <p className="text-sm text-gray-600">Score</p>
                </div>
              </div>

              <div className="space-y-4">
                {examResults.passed && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-800 font-medium">🏆 Badge Awarded!</p>
                    <p className="text-green-700 text-sm">You've earned the {examResults.certification.name} certification badge.</p>
                  </div>
                )}
                
                <button
                  onClick={resetExam}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Try Another Certification
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CertificationExamApp;
