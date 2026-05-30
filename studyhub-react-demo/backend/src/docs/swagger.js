export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'StudyHub API',
    version: '1.0.0',
    description: 'Swagger documentation for the StudyHub backend.'
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Local development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  tags: [
    { name: 'System' },
    { name: 'Discovery' },
    { name: 'Bookings' },
    { name: 'Tutor Profile' },
    { name: 'Auth' },
    { name: 'Applications' },
    { name: 'Admin' }
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        responses: {
          200: { description: 'Service is healthy' }
        }
      }
    },
    '/api/subjects': {
      get: {
        tags: ['Discovery'],
        summary: 'List available subjects',
        responses: {
          200: { description: 'Subject list' }
        }
      }
    },
    '/api/dashboard': {
      get: {
        tags: ['Discovery'],
        summary: 'Get dashboard summary',
        responses: {
          200: { description: 'Dashboard payload' }
        }
      }
    },
    '/api/tutors': {
      get: {
        tags: ['Discovery'],
        summary: 'List tutors',
        parameters: [
          { name: 'subject', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'timeSlot', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Tutor list' }
        }
      }
    },
    '/api/bookings': {
      get: {
        tags: ['Bookings'],
        summary: 'List bookings',
        responses: {
          200: { description: 'Booking list' }
        }
      },
      post: {
        tags: ['Bookings'],
        summary: 'Create a booking',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  tutorId: { type: 'number' },
                  tutorName: { type: 'string' },
                  subject: { type: 'string' },
                  date: { type: 'string' },
                  time: { type: 'string' },
                  duration: { type: 'number' },
                  price: { type: 'number' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Booking created' }
        }
      }
    },
    '/api/bookings/{id}/cancel': {
      patch: {
        tags: ['Bookings'],
        summary: 'Cancel a booking',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'number' } }],
        responses: {
          200: { description: 'Booking cancelled' }
        }
      }
    },
    '/api/bookings/{id}/reviews': {
      post: {
        tags: ['Bookings'],
        summary: 'Add booking review',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'number' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  rating: { type: 'number', minimum: 1, maximum: 5 },
                  comment: { type: 'string' }
                },
                required: ['rating', 'comment']
              }
            }
          }
        },
        responses: {
          201: { description: 'Review saved' }
        }
      }
    },
    '/api/reports': {
      post: {
        tags: ['Bookings'],
        summary: 'Create a report',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  bookingId: { type: 'number' },
                  tutorName: { type: 'string' },
                  studentName: { type: 'string' },
                  issue: { type: 'string' },
                  detail: { type: 'string' }
                },
                required: ['bookingId', 'tutorName', 'detail']
              }
            }
          }
        },
        responses: {
          201: { description: 'Report created' }
        }
      }
    },
    '/api/tutor/profile': {
      get: {
        tags: ['Tutor Profile'],
        summary: 'Get tutor profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Tutor profile' }
        }
      },
      patch: {
        tags: ['Tutor Profile'],
        summary: 'Update tutor profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  bio: { type: 'string' },
                  skills: { type: 'array', items: { type: 'string' } },
                  coverImage: { type: 'string' },
                  totalHours: { type: 'number' },
                  totalStudents: { type: 'number' },
                  rating: { type: 'number' },
                  scheduleSlots: { type: 'array', items: { type: 'string' } },
                  selectedSlots: { type: 'array', items: { type: 'string' } },
                  declineCount: { type: 'number' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Tutor profile updated' }
        }
      }
    },
    '/api/tutor/profile/certificates': {
      post: {
        tags: ['Tutor Profile'],
        summary: 'Add tutor certificate',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', properties: { name: { type: 'string' }, url: { type: 'string' }, issuedAt: { type: 'string' } }, required: ['name'] }
            }
          }
        },
        responses: {
          201: { description: 'Certificate added' }
        }
      }
    },
    '/api/tutor/profile/documents': {
      post: {
        tags: ['Tutor Profile'],
        summary: 'Add tutor document',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', properties: { name: { type: 'string' }, url: { type: 'string' }, uploadedAt: { type: 'string' } }, required: ['name'] }
            }
          }
        },
        responses: {
          201: { description: 'Document added' }
        }
      }
    },
    '/api/auth/otp/send': {
      post: {
        tags: ['Auth'],
        summary: 'Send OTP',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' } }, required: ['email'] } } } },
        responses: {
          200: { description: 'OTP sent' }
        }
      }
    },
    '/api/auth/otp/verify': {
      post: {
        tags: ['Auth'],
        summary: 'Verify OTP',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, otp: { type: 'string' } }, required: ['email', 'otp'] } } } },
        responses: {
          200: { description: 'OTP verified' }
        }
      }
    },
    '/api/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log in',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } }, required: ['email', 'password'] } } } },
        responses: {
          200: { description: 'Login successful' }
        }
      }
    },
    '/api/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a user',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' }, role: { type: 'string', enum: ['user', 'tutor', 'admin'] } }, required: ['name', 'email', 'password'] } } } },
        responses: {
          201: { description: 'Registration successful' }
        }
      }
    },
    '/api/applications': {
      post: {
        tags: ['Applications'],
        summary: 'Submit tutor application',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' }, phone: { type: 'string' }, subjects: { type: 'array', items: { type: 'string' } }, education: { type: 'string' }, experience: { type: 'string' }, price: { type: 'string' }, bio: { type: 'string' } }, required: ['name', 'email', 'subjects'] } } } },
        responses: {
          201: { description: 'Application submitted' }
        }
      }
    },
    '/api/admin/overview': {
      get: {
        tags: ['Admin'],
        summary: 'Get admin overview',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Admin stats' }
        }
      }
    },
    '/api/admin/users': {
      get: {
        tags: ['Admin'],
        summary: 'List admin users',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'User list' }
        }
      }
    },
    '/api/admin/tutors': {
      get: {
        tags: ['Admin'],
        summary: 'List admin tutors',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Tutor list' }
        }
      }
    },
    '/api/admin/applications': {
      get: {
        tags: ['Admin'],
        summary: 'List admin applications',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Application list' }
        }
      }
    },
    '/api/admin/reports': {
      get: {
        tags: ['Admin'],
        summary: 'List admin reports',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Report list' }
        }
      }
    },
    '/api/admin/activities': {
      get: {
        tags: ['Admin'],
        summary: 'List admin activities',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Activity list' }
        }
      }
    },
    '/api/admin/applications/{id}': {
      patch: {
        tags: ['Admin'],
        summary: 'Approve or reject an application',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'number' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' } }, required: ['status'] } } } },
        responses: {
          200: { description: 'Application updated' }
        }
      }
    },
    '/api/admin/users/{email}/status': {
      patch: {
        tags: ['Admin'],
        summary: 'Update user status',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'email', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' } }, required: ['status'] } } } },
        responses: {
          200: { description: 'User status updated' }
        }
      }
    }
  }
};