
module.exports = {
  modelData: {
    Epic: [
      {
        id: 'epics/authentication',
        meta: {
          status: 'created',
          timeline: {
            startAt: 0
          }
        },
        title: 'Authentication',
        stories: [
          {
            id: 'stories/authentication/a-user-should-be-able-to-register',
            meta: {
              epic: 'authentication',
              estimates: {
                low: 12,
                high: 40
              },
              status: 'created',
              github: {
                issue: 60
              },
              priority: 'high'
            },
            title: 'A User should be able to register.',
            description: 'As a User I would like to register so that I can use the application.',
            isComplete: false,
            slug: 'a-user-should-be-able-to-register',
            acceptanceCriteria: [
              'A user can visit the signup form, supply their name, email, and password',
              'The signup form should validate the user\'s information and supply errors',
              'The user should receive a confirmation email',
              'The user should show up in our database as confirmed after clicking the confirmation link'
            ],
            mockupLinks: {
              'Invision: Registration Form': 'https://invisionapp.com',
              'Invision: Registration Form Error State': 'https://invisionapp.com'
            }
          },
          {
            id: 'stories/authentication/a-user-should-be-able-to-login',
            meta: {
              epic: 'authentication',
              estimates: {
                low: 12,
                high: 40
              },
              status: 'created',
              github: {
                issue: 59
              },
              priority: 'HIGH AF'
            },
            title: 'A User should be able to login.',
            description: 'As a User I would like to login so that I can use the application.',
            isComplete: false,
            slug: 'a-user-should-be-able-to-login',
            acceptanceCriteria: [
              'A user can visit the signup form, supply their name, email, and password',
              'The signup form should validate the user\'s information and supply errors',
              'The user should receive a confirmation email',
              'The user should show up in our database as confirmed after clicking the confirmation link'
            ],
            mockupLinks: {
              'Invision: Login Form': 'https://invisionapp.com',
              'Invision: Login Form Error State ': 'https://invisionapp.com'
            }
          }
        ],
        description: 'The Authentication stories cover users logging in and out of the application, as well as the roles and permissions granted to these users and how they are enforced in the application.',
        isComplete: false,
        slug: 'authentication',
        totalEstimates: {
          high: 80,
          low: 24
        }
      },
      {
        id: 'epics/content-management',
        meta: {
          priority: 'high',
          status: 'gathering-requirements',
          timeline: {
            startAt: 32
          }
        },
        title: 'Content Management',
        stories: [
          {
            id: 'stories/content-management/a-content-moderator-should-be-able-to-manage-blog-posts',
            meta: {
              epic: 'content-management',
              estimates: {
                low: 12,
                high: 32
              },
              status: 'created',
              github: {
                issue: 61
              },
              priority: 'high'
            },
            title: 'A Content Moderator should be able to manage blog posts',
            description: 'As a Content Moderator I want to be able to manage blog posts so I can engage with our customers.',
            isComplete: false,
            slug: 'a-content-moderator-should-be-able-to-manage-blog-posts',
            acceptanceCriteria: [
              'A Content Moderator should be able to create a blog post',
              'A Content Moderator should be able to update a blog post'
            ],
            mockupLinks: {}
          },
          {
            id: 'stories/content-management/a-content-moderator-should-be-able-to-manage-the-product-catalog',
            meta: {
              epic: 'content-management',
              estimates: {
                low: 8,
                high: 16
              },
              status: 'created',
              github: {
                issue: 62
              },
              priority: 'medium'
            },
            title: 'A Content Moderator should be able to manage the product catalog',
            description: 'As a Content Moderator I want to be able to manage the product catalog so I can sell our inventory.',
            isComplete: false,
            slug: 'a-content-moderator-should-be-able-to-manage-the-product-catalog',
            acceptanceCriteria: [
              'A Content Moderator should be able to create a product',
              'A Content Moderator should be able to update a product',
              'A Content Moderator should be able to delete a product'
            ],
            mockupLinks: {}
          }
        ],
        description: 'This covers how the site\'s products are created, updated, etc.',
        isComplete: false,
        slug: 'content-management',
        totalEstimates: {
          high: 48,
          low: 20
        }
      },
      {
        id: 'epics/order-lifecycle-management',
        meta: {
          priority: 'high',
          status: 'gathering-requirements',
          timeline: {
            startAt: 64
          }
        },
        title: 'Order Lifecycle Management',
        stories: [
          {
            id: 'stories/order-lifecycle-management/a-customer-should-be-able-to-place-an-order',
            meta: {
              epic: 'order-lifecycle-management',
              estimates: {
                low: 8,
                high: 16
              },
              status: 'created',
              github: {
                issue: 64
              },
              priority: 'medium'
            },
            title: 'A customer should be able to place an order',
            description: 'As a customer I want to be able to place an order so I can get the product I want delivered to me.',
            isComplete: false,
            slug: 'a-customer-should-be-able-to-place-an-order',
            acceptanceCriteria: [],
            mockupLinks: {}
          },
          {
            id: 'stories/order-lifecycle-management/a-customer-should-be-able-to-view-their-order-history',
            meta: {
              epic: 'order-lifecycle-management',
              estimates: {
                low: 8,
                high: 16
              },
              status: 'created',
              github: {
                issue: 65
              },
              priority: 'medium'
            },
            title: 'A customer should be able to view their order history',
            description: 'As a customer I want to be able to view my order history so I can see what I have ordered.',
            isComplete: false,
            slug: 'a-customer-should-be-able-to-view-their-order-history',
            acceptanceCriteria: [],
            mockupLinks: {}
          },
          {
            id: 'stories/order-lifecycle-management/a-customer-should-be-able-to-cancel-an-order',
            meta: {
              epic: 'order-lifecycle-management',
              estimates: {
                low: 8,
                high: 16
              },
              status: 'created',
              github: {
                issue: 63
              },
              priority: 'medium'
            },
            title: 'A customer should be able to cancel an order',
            description: 'As a customer I want to be able to cancel an order so I can get my money back.',
            isComplete: false,
            slug: 'a-customer-should-be-able-to-cancel-an-order',
            acceptanceCriteria: [],
            mockupLinks: {}
          },
          {
            id: 'stories/order-lifecycle-management/a-customer-should-receive-an-email-when-an-order-is-placed',
            meta: {
              epic: 'order-lifecycle-management',
              estimates: {
                low: 8,
                high: 16
              },
              status: 'created',
              github: {
                issue: 66
              },
              priority: 'medium'
            },
            title: 'A customer should receive an email when an order is placed',
            description: 'As a customer I want to receive an email when an order is placed so I can track my order.',
            isComplete: false,
            slug: 'a-customer-should-receive-an-email-when-an-order-is-placed',
            acceptanceCriteria: [],
            mockupLinks: {}
          },
          {
            id: 'stories/order-lifecycle-management/a-store-administrator-should-be-able-to-cancel-an-order',
            meta: {
              epic: 'order-lifecycle-management',
              estimates: {
                low: 8,
                high: 16
              },
              status: 'created',
              github: {
                issue: 68
              },
              priority: 'medium'
            },
            title: 'A Store Administrator should be able to cancel an order',
            description: 'As a store administrator I want to be able to cancel an order for a customer so they can get their money back.',
            isComplete: false,
            slug: 'a-store-administrator-should-be-able-to-cancel-an-order',
            acceptanceCriteria: [],
            mockupLinks: {}
          }
        ],
        description: 'This covers how orders are received, processed, and fulfilled.',
        isComplete: false,
        slug: 'order-lifecycle-management',
        totalEstimates: {
          high: 80,
          low: 40
        }
      },
      {
        id: 'epics/payment-processing',
        meta: {
          priority: 'high',
          status: 'gathering-requirements',
          timeline: {
            startAt: 124
          }
        },
        title: 'Payment Processing',
        stories: [
          {
            id: 'stories/payment-processing/a-customer-should-be-able-to-pay-with-a-credit-card',
            meta: {
              epic: 'payment-processing',
              estimates: {
                low: 8,
                high: 16
              },
              status: 'created',
              github: {
                issue: 69
              },
              priority: 'medium'
            },
            title: 'A customer should be able to pay with a credit card',
            description: 'As a customer I want to be able to pay with a credit card so I can complete my order',
            isComplete: false,
            slug: 'a-customer-should-be-able-to-pay-with-a-credit-card',
            acceptanceCriteria: [],
            mockupLinks: {}
          },
          {
            id: 'stories/payment-processing/a-customer-should-be-able-to-pay-with-paypal',
            meta: {
              epic: 'payment-processing',
              estimates: {
                low: 8,
                high: 16
              },
              status: 'created',
              github: {},
              priority: 'medium'
            },
            title: 'A customer should be able to pay with paypal',
            description: 'As a customer I want to be able to pay with paypal so I can complete my order',
            isComplete: false,
            slug: 'a-customer-should-be-able-to-pay-with-paypal',
            acceptanceCriteria: [],
            mockupLinks: {}
          },
          {
            id: 'stories/payment-processing/a-customer-should-be-able-to-pay-with-a-gift-card',
            meta: {
              epic: 'payment-processing',
              estimates: {
                low: 8,
                high: 16
              },
              status: 'created',
              github: {},
              priority: 'medium'
            },
            title: 'A customer should be able to pay with a gift card',
            description: 'As a customer I want to be able to pay with a gift card so I can complete my order',
            isComplete: false,
            slug: 'a-customer-should-be-able-to-pay-with-a-gift-card',
            acceptanceCriteria: [],
            mockupLinks: {}
          }
        ],
        description: 'This covers everything related to payment processing, including the payment gateway integration.',
        isComplete: false,
        slug: 'payment-processing',
        totalEstimates: {
          high: 48,
          low: 24
        }
      },
      {
        id: 'epics/product-search-and-browsing',
        meta: {
          priority: 'high',
          status: 'gathering-requirements',
          timeline: {
            startAt: 172
          }
        },
        title: 'Product Search and Browsing',
        stories: [
          {
            id: 'stories/product-search-and-browsing/a-user-should-be-able-to-search-for-products-by-name',
            meta: {
              epic: 'product-search-and-browsing',
              estimates: {
                low: 8,
                high: 16
              },
              status: 'created',
              github: {},
              priority: 'medium'
            },
            title: 'A user should be able to search for products by name',
            description: '',
            isComplete: false,
            slug: 'a-user-should-be-able-to-search-for-products-by-name',
            acceptanceCriteria: [],
            mockupLinks: {}
          },
          {
            id: 'stories/product-search-and-browsing/a-user-should-be-able-to-search-for-products-by-category',
            meta: {
              epic: 'product-search-and-browsing',
              estimates: {
                low: 8,
                high: 16
              },
              status: 'created',
              github: {},
              priority: 'medium'
            },
            title: 'A user should be able to search for products by category',
            description: '',
            isComplete: false,
            slug: 'a-user-should-be-able-to-search-for-products-by-category',
            acceptanceCriteria: [],
            mockupLinks: {}
          },
          {
            id: 'stories/product-search-and-browsing/a-user-should-be-able-to-search-for-products-by-brand',
            meta: {
              epic: 'product-search-and-browsing',
              estimates: {
                low: 8,
                high: 16
              },
              status: 'created',
              github: {},
              priority: 'medium'
            },
            title: 'A user should be able to search for products by brand',
            description: '',
            isComplete: false,
            slug: 'a-user-should-be-able-to-search-for-products-by-brand',
            acceptanceCriteria: [],
            mockupLinks: {}
          }
        ],
        description: 'This covers everything related to a user\'s journey browsing and searching for products.',
        isComplete: false,
        slug: 'product-search-and-browsing',
        totalEstimates: {
          high: 48,
          low: 24
        }
      }
    ],
    Story: [
      {
        id: 'stories/payment-processing/a-customer-should-be-able-to-pay-with-a-gift-card',
        meta: {
          epic: 'payment-processing',
          estimates: {
            low: 8,
            high: 16
          },
          status: 'created',
          github: {},
          priority: 'medium'
        },
        title: 'A customer should be able to pay with a gift card',
        description: 'As a customer I want to be able to pay with a gift card so I can complete my order',
        isComplete: false,
        slug: 'a-customer-should-be-able-to-pay-with-a-gift-card',
        acceptanceCriteria: [],
        mockupLinks: {}
      },
      {
        id: 'stories/payment-processing/a-customer-should-be-able-to-pay-with-paypal',
        meta: {
          epic: 'payment-processing',
          estimates: {
            low: 8,
            high: 16
          },
          status: 'created',
          github: {},
          priority: 'medium'
        },
        title: 'A customer should be able to pay with paypal',
        description: 'As a customer I want to be able to pay with paypal so I can complete my order',
        isComplete: false,
        slug: 'a-customer-should-be-able-to-pay-with-paypal',
        acceptanceCriteria: [],
        mockupLinks: {}
      },
      {
        id: 'stories/product-search-and-browsing/a-user-should-be-able-to-search-for-products-by-brand',
        meta: {
          epic: 'product-search-and-browsing',
          estimates: {
            low: 8,
            high: 16
          },
          status: 'created',
          github: {},
          priority: 'medium'
        },
        title: 'A user should be able to search for products by brand',
        description: '',
        isComplete: false,
        slug: 'a-user-should-be-able-to-search-for-products-by-brand',
        acceptanceCriteria: [],
        mockupLinks: {}
      },
      {
        id: 'stories/product-search-and-browsing/a-user-should-be-able-to-search-for-products-by-category',
        meta: {
          epic: 'product-search-and-browsing',
          estimates: {
            low: 8,
            high: 16
          },
          status: 'created',
          github: {},
          priority: 'medium'
        },
        title: 'A user should be able to search for products by category',
        description: '',
        isComplete: false,
        slug: 'a-user-should-be-able-to-search-for-products-by-category',
        acceptanceCriteria: [],
        mockupLinks: {}
      },
      {
        id: 'stories/product-search-and-browsing/a-user-should-be-able-to-search-for-products-by-name',
        meta: {
          epic: 'product-search-and-browsing',
          estimates: {
            low: 8,
            high: 16
          },
          status: 'created',
          github: {},
          priority: 'medium'
        },
        title: 'A user should be able to search for products by name',
        description: '',
        isComplete: false,
        slug: 'a-user-should-be-able-to-search-for-products-by-name',
        acceptanceCriteria: [],
        mockupLinks: {}
      },
      {
        id: 'stories/authentication/a-user-should-be-able-to-login',
        meta: {
          epic: 'authentication',
          estimates: {
            low: 12,
            high: 40
          },
          status: 'created',
          github: {
            issue: 59
          },
          priority: 'HIGH AF'
        },
        title: 'A User should be able to login.',
        description: 'As a User I would like to login so that I can use the application.',
        isComplete: false,
        slug: 'a-user-should-be-able-to-login',
        acceptanceCriteria: [
          'A user can visit the signup form, supply their name, email, and password',
          'The signup form should validate the user\'s information and supply errors',
          'The user should receive a confirmation email',
          'The user should show up in our database as confirmed after clicking the confirmation link'
        ],
        mockupLinks: {
          'Invision: Login Form': 'https://invisionapp.com',
          'Invision: Login Form Error State ': 'https://invisionapp.com'
        }
      },
      {
        id: 'stories/authentication/a-user-should-be-able-to-register',
        meta: {
          epic: 'authentication',
          estimates: {
            low: 12,
            high: 40
          },
          status: 'created',
          github: {
            issue: 60
          },
          priority: 'high'
        },
        title: 'A User should be able to register.',
        description: 'As a User I would like to register so that I can use the application.',
        isComplete: false,
        slug: 'a-user-should-be-able-to-register',
        acceptanceCriteria: [
          'A user can visit the signup form, supply their name, email, and password',
          'The signup form should validate the user\'s information and supply errors',
          'The user should receive a confirmation email',
          'The user should show up in our database as confirmed after clicking the confirmation link'
        ],
        mockupLinks: {
          'Invision: Registration Form': 'https://invisionapp.com',
          'Invision: Registration Form Error State': 'https://invisionapp.com'
        }
      },
      {
        id: 'stories/content-management/a-content-moderator-should-be-able-to-manage-blog-posts',
        meta: {
          epic: 'content-management',
          estimates: {
            low: 12,
            high: 32
          },
          status: 'created',
          github: {
            issue: 61
          },
          priority: 'high'
        },
        title: 'A Content Moderator should be able to manage blog posts',
        description: 'As a Content Moderator I want to be able to manage blog posts so I can engage with our customers.',
        isComplete: false,
        slug: 'a-content-moderator-should-be-able-to-manage-blog-posts',
        acceptanceCriteria: [
          'A Content Moderator should be able to create a blog post',
          'A Content Moderator should be able to update a blog post'
        ],
        mockupLinks: {}
      },
      {
        id: 'stories/content-management/a-content-moderator-should-be-able-to-manage-the-product-catalog',
        meta: {
          epic: 'content-management',
          estimates: {
            low: 8,
            high: 16
          },
          status: 'created',
          github: {
            issue: 62
          },
          priority: 'medium'
        },
        title: 'A Content Moderator should be able to manage the product catalog',
        description: 'As a Content Moderator I want to be able to manage the product catalog so I can sell our inventory.',
        isComplete: false,
        slug: 'a-content-moderator-should-be-able-to-manage-the-product-catalog',
        acceptanceCriteria: [
          'A Content Moderator should be able to create a product',
          'A Content Moderator should be able to update a product',
          'A Content Moderator should be able to delete a product'
        ],
        mockupLinks: {}
      },
      {
        id: 'stories/order-lifecycle-management/a-customer-should-be-able-to-cancel-an-order',
        meta: {
          epic: 'order-lifecycle-management',
          estimates: {
            low: 8,
            high: 16
          },
          status: 'created',
          github: {
            issue: 63
          },
          priority: 'medium'
        },
        title: 'A customer should be able to cancel an order',
        description: 'As a customer I want to be able to cancel an order so I can get my money back.',
        isComplete: false,
        slug: 'a-customer-should-be-able-to-cancel-an-order',
        acceptanceCriteria: [],
        mockupLinks: {}
      },
      {
        id: 'stories/order-lifecycle-management/a-customer-should-be-able-to-place-an-order',
        meta: {
          epic: 'order-lifecycle-management',
          estimates: {
            low: 8,
            high: 16
          },
          status: 'created',
          github: {
            issue: 64
          },
          priority: 'medium'
        },
        title: 'A customer should be able to place an order',
        description: 'As a customer I want to be able to place an order so I can get the product I want delivered to me.',
        isComplete: false,
        slug: 'a-customer-should-be-able-to-place-an-order',
        acceptanceCriteria: [],
        mockupLinks: {}
      },
      {
        id: 'stories/order-lifecycle-management/a-customer-should-be-able-to-view-their-order-history',
        meta: {
          epic: 'order-lifecycle-management',
          estimates: {
            low: 8,
            high: 16
          },
          status: 'created',
          github: {
            issue: 65
          },
          priority: 'medium'
        },
        title: 'A customer should be able to view their order history',
        description: 'As a customer I want to be able to view my order history so I can see what I have ordered.',
        isComplete: false,
        slug: 'a-customer-should-be-able-to-view-their-order-history',
        acceptanceCriteria: [],
        mockupLinks: {}
      },
      {
        id: 'stories/order-lifecycle-management/a-store-administrator-should-be-able-to-cancel-an-order',
        meta: {
          epic: 'order-lifecycle-management',
          estimates: {
            low: 8,
            high: 16
          },
          status: 'created',
          github: {
            issue: 68
          },
          priority: 'medium'
        },
        title: 'A Store Administrator should be able to cancel an order',
        description: 'As a store administrator I want to be able to cancel an order for a customer so they can get their money back.',
        isComplete: false,
        slug: 'a-store-administrator-should-be-able-to-cancel-an-order',
        acceptanceCriteria: [],
        mockupLinks: {}
      },
      {
        id: 'stories/order-lifecycle-management/a-customer-should-receive-an-email-when-an-order-is-placed',
        meta: {
          epic: 'order-lifecycle-management',
          estimates: {
            low: 8,
            high: 16
          },
          status: 'created',
          github: {
            issue: 66
          },
          priority: 'medium'
        },
        title: 'A customer should receive an email when an order is placed',
        description: 'As a customer I want to receive an email when an order is placed so I can track my order.',
        isComplete: false,
        slug: 'a-customer-should-receive-an-email-when-an-order-is-placed',
        acceptanceCriteria: [],
        mockupLinks: {}
      },
      {
        id: 'stories/payment-processing/a-customer-should-be-able-to-pay-with-a-credit-card',
        meta: {
          epic: 'payment-processing',
          estimates: {
            low: 8,
            high: 16
          },
          status: 'created',
          github: {
            issue: 69
          },
          priority: 'medium'
        },
        title: 'A customer should be able to pay with a credit card',
        description: 'As a customer I want to be able to pay with a credit card so I can complete my order',
        isComplete: false,
        slug: 'a-customer-should-be-able-to-pay-with-a-credit-card',
        acceptanceCriteria: [],
        mockupLinks: {}
      }
    ],
    Standup: [],
    Decision: [
      {
        id: 'decisions/big-commerce-or-saleor',
        meta: {
          status: 'completed',
          dueBy: 'February 1st, 2022',
          result: {
            option: 'BigCommerce',
            madeAt: 'January 15th, 2022',
            approvedBy: 'Jack CEO'
          }
        },
        title: 'BigCommerce or Saleor',
        options: [
          'BigCommerce',
          'Option Two'
        ],
        prosAndCons: [
          {
            title: 'BigCommerce',
            pros: [
              'Scaling, Availability, and PCI Compliance is guaranteed by BigCommerce',
              'Plug and play integration with most major third party providers'
            ],
            cons: [
              'May be limited by the feature set of the platform',
              'Customized checkout experience has limitations',
              'Monthly subscription costs and transaction fees'
            ]
          },
          {
            title: 'Option Two',
            pros: [
              'Can be heavily customized',
              'Free'
            ],
            cons: [
              'Scaling, Availability, PCI compliance is our responsibility',
              'Customizations will cost developer time and money'
            ]
          }
        ],
        description: 'We need to make a decision about which e-commerce platform to use. The two main options are BigCommerce or Saleor.\nBigcommerce is a hosted platform that we would pay monthly to use.Saleor is a self-hosted open source platform that we would need to host and maintain ourselves.'
      },
      {
        id: 'decisions/headless-or-native-storefront',
        meta: {
          status: 'pending',
          dueBy: 'February 15th, 2022'
        },
        title: 'Headless or Native Storefront',
        options: [
          'Headless Storefront',
          'Native Stencil Theme'
        ],
        prosAndCons: [
          {
            title: 'Headless Storefront',
            pros: [
              'Complete customization',
              'Best possible cache performance for frontend'
            ],
            cons: [
              'Requires development / effort'
            ]
          },
          {
            title: 'Native Stencil Theme',
            pros: [
              'Can leverage existing themes and templates',
              'Leverages BigCommerce for hosting the frontend'
            ],
            cons: [
              'Limited options for customization',
              'Slower performance compared to headless static HTML behind a CDN'
            ]
          }
        ],
        description: 'We need to decide whether to use a headless frontend, or to use BigCommerce\'s native stencil theme.'
      }
    ]
  },
  failedExports: [],
  availableActions: [
    'github:publish-all',
    'github:setup'
  ],
  packageRoot: '/Users/jon/@active-mdx/packages/software-project-demo-site/docs',
  rootPath: '/Users/jon/@active-mdx/packages/software-project-demo-site/docs',
  name: '/Users/jon/@active-mdx/packages/software-project-demo-site/docs',
  models: [
    {
      name: 'Epic',
      prefix: 'epics',
      schema: {
        type: 'object',
        flags: {
          unknown: true
        },
        keys: {
          id: {
            type: 'string',
            flags: {
              presence: 'required'
            }
          },
          title: {
            type: 'string',
            flags: {
              presence: 'required'
            },
            rules: [
              {
                name: 'min',
                args: {
                  limit: 1
                }
              }
            ]
          }
        }
      },
      availableActions: [
        'expand'
      ],
      availableQueries: [],
      matchingPaths: [
        'epics/authentication',
        'epics/content-management',
        'epics/order-lifecycle-management',
        'epics/payment-processing',
        'epics/product-search-and-browsing'
      ],
      inflections: {
        modelName: 'epic',
        singular: 'epic',
        plural: 'epics',
        className: 'Epic'
      }
    },
    {
      name: 'Story',
      prefix: 'stories',
      schema: {
        type: 'object',
        flags: {
          unknown: true
        },
        keys: {
          title: {
            type: 'string',
            flags: {
              presence: 'required'
            }
          },
          description: {
            type: 'string',
            flags: {
              presence: 'required'
            }
          },
          id: {
            type: 'string',
            flags: {
              presence: 'required'
            }
          },
          totalEstimates: {
            type: 'object',
            keys: {
              high: {
                type: 'number',
                flags: {
                  presence: 'required'
                }
              },
              low: {
                type: 'number',
                flags: {
                  presence: 'required'
                }
              }
            }
          },
          meta: {
            type: 'object',
            flags: {
              presence: 'required',
              unknown: true
            },
            keys: {
              epic: {
                type: 'string',
                flags: {
                  presence: 'required'
                }
              },
              status: {
                type: 'string',
                flags: {
                  presence: 'required'
                },
                rules: [
                  {
                    name: 'pattern',
                    args: {
                      regex: '/^(created|in-progress|qa|approved|complete)$/',
                      options: {
                        name: 'valid statuses'
                      }
                    }
                  }
                ]
              },
              estimates: {
                type: 'object',
                flags: {
                  unknown: true,
                  presence: 'required'
                },
                keys: {
                  high: {
                    type: 'number',
                    flags: {
                      presence: 'required'
                    }
                  },
                  low: {
                    type: 'number',
                    flags: {
                      presence: 'required'
                    }
                  }
                }
              },
              github: {
                type: 'object',
                keys: {
                  issue: {
                    type: 'number'
                  }
                }
              }
            }
          }
        }
      },
      availableActions: [
        'expand',
        'github:publish'
      ],
      availableQueries: [],
      matchingPaths: [
        'stories/authentication/a-user-should-be-able-to-login',
        'stories/authentication/a-user-should-be-able-to-register',
        'stories/content-management/a-content-moderator-should-be-able-to-manage-blog-posts',
        'stories/order-lifecycle-management/a-customer-should-be-able-to-cancel-an-order',
        'stories/content-management/a-content-moderator-should-be-able-to-manage-the-product-catalog',
        'stories/order-lifecycle-management/a-customer-should-be-able-to-place-an-order',
        'stories/order-lifecycle-management/a-customer-should-be-able-to-view-their-order-history',
        'stories/order-lifecycle-management/a-customer-should-receive-an-email-when-an-order-is-placed',
        'stories/order-lifecycle-management/a-store-administrator-should-be-able-to-cancel-an-order',
        'stories/payment-processing/a-customer-should-be-able-to-pay-with-a-credit-card',
        'stories/payment-processing/a-customer-should-be-able-to-pay-with-a-gift-card',
        'stories/payment-processing/a-customer-should-be-able-to-pay-with-paypal',
        'stories/product-search-and-browsing/a-user-should-be-able-to-search-for-products-by-brand',
        'stories/product-search-and-browsing/a-user-should-be-able-to-search-for-products-by-category',
        'stories/product-search-and-browsing/a-user-should-be-able-to-search-for-products-by-name'
      ],
      inflections: {
        modelName: 'story',
        singular: 'story',
        plural: 'stories',
        className: 'Story'
      }
    },
    {
      name: 'Standup',
      prefix: 'standups',
      schema: {
        type: 'object',
        flags: {
          unknown: true
        },
        keys: {
          id: {
            type: 'string',
            flags: {
              presence: 'required'
            }
          },
          title: {
            type: 'string',
            flags: {
              presence: 'required'
            },
            rules: [
              {
                name: 'min',
                args: {
                  limit: 1
                }
              }
            ]
          }
        }
      },
      availableActions: [
        'expand'
      ],
      availableQueries: [],
      matchingPaths: [],
      inflections: {
        modelName: 'standup',
        singular: 'standup',
        plural: 'standups',
        className: 'Standup'
      }
    },
    {
      name: 'Decision',
      prefix: 'decisions',
      schema: {
        type: 'object',
        keys: {
          id: {
            type: 'string',
            flags: {
              presence: 'required'
            }
          },
          title: {
            type: 'string',
            flags: {
              presence: 'required'
            }
          },
          description: {
            type: 'string',
            flags: {
              presence: 'required'
            }
          },
          options: {
            type: 'array',
            flags: {
              presence: 'required'
            },
            rules: [
              {
                name: 'min',
                args: {
                  limit: 1
                }
              }
            ],
            items: [
              {
                type: 'string'
              }
            ]
          },
          meta: {
            type: 'object',
            flags: {
              unknown: true
            },
            keys: {
              status: {
                type: 'string',
                flags: {
                  presence: 'required'
                }
              },
              dueBy: {
                type: 'string',
                flags: {
                  presence: 'required'
                }
              },
              result: {
                type: 'object',
                flags: {
                  unknown: true
                },
                keys: {
                  option: {
                    type: 'string'
                  },
                  madeAt: {
                    type: 'string'
                  },
                  approvedBy: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      },
      availableActions: [
        'expand'
      ],
      availableQueries: [],
      matchingPaths: [
        'decisions/headless-or-native-storefront',
        'decisions/big-commerce-or-saleor'
      ],
      inflections: {
        modelName: 'decision',
        singular: 'decision',
        plural: 'decisions',
        className: 'Decision'
      }
    }
  ],
  recent: [
    [
      'stories/payment-processing/a-customer-should-be-able-to-pay-with-a-credit-card',
      new Date('2022-02-11T07:55:34.763Z'),
      'Story'
    ],
    [
      'stories/order-lifecycle-management/a-customer-should-receive-an-email-when-an-order-is-placed',
      new Date('2022-02-11T07:55:33.756Z'),
      'Story'
    ],
    [
      'stories/order-lifecycle-management/a-store-administrator-should-be-able-to-cancel-an-order',
      new Date('2022-02-11T07:55:33.550Z'),
      'Story'
    ],
    [
      'stories/order-lifecycle-management/a-customer-should-be-able-to-view-their-order-history',
      new Date('2022-02-11T07:55:32.596Z'),
      'Story'
    ],
    [
      'stories/order-lifecycle-management/a-customer-should-be-able-to-place-an-order',
      new Date('2022-02-11T07:55:32.417Z'),
      'Story'
    ]
  ],
  modelAliases: {
    Epic: 'Epic',
    epic: 'Epic',
    epics: 'Epic',
    Story: 'Story',
    story: 'Story',
    stories: 'Story',
    Standup: 'Standup',
    standup: 'Standup',
    standups: 'Standup',
    Decision: 'Decision',
    decision: 'Decision',
    decisions: 'Decision'
  },
  itemIds: [
    'architecture/api-documentation',
    'architecture/hosting',
    'architecture/data-modeling',
    'architecture/software-stack',
    'decisions/headless-or-native-storefront',
    'decisions/big-commerce-or-saleor',
    'design/asset-library',
    'design/style-guide',
    'epics/authentication',
    'epics/content-management',
    'epics/order-lifecycle-management',
    'epics/payment-processing',
    'epics/product-search-and-browsing',
    'quality/end-to-end-testing',
    'quality/launch-checklist',
    'stories/authentication/a-user-should-be-able-to-login',
    'stories/authentication/a-user-should-be-able-to-register',
    'stories/content-management/a-content-moderator-should-be-able-to-manage-blog-posts',
    'stories/order-lifecycle-management/a-customer-should-be-able-to-cancel-an-order',
    'stories/content-management/a-content-moderator-should-be-able-to-manage-the-product-catalog',
    'stories/order-lifecycle-management/a-customer-should-be-able-to-place-an-order',
    'stories/order-lifecycle-management/a-customer-should-be-able-to-view-their-order-history',
    'stories/order-lifecycle-management/a-customer-should-receive-an-email-when-an-order-is-placed',
    'stories/order-lifecycle-management/a-store-administrator-should-be-able-to-cancel-an-order',
    'stories/payment-processing/a-customer-should-be-able-to-pay-with-a-credit-card',
    'stories/payment-processing/a-customer-should-be-able-to-pay-with-a-gift-card',
    'stories/payment-processing/a-customer-should-be-able-to-pay-with-paypal',
    'stories/product-search-and-browsing/a-user-should-be-able-to-search-for-products-by-brand',
    'stories/product-search-and-browsing/a-user-should-be-able-to-search-for-products-by-category',
    'stories/product-search-and-browsing/a-user-should-be-able-to-search-for-products-by-name',
    'table-of-contents',
    'templates/Decision',
    'templates/Epic',
    'templates/Standup',
    'templates/Story'
  ]
}     
    
