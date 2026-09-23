import type { GlobalConfig } from 'payload'
import { area, copy, media, seo, text } from '@/collections/fields'

export const AboutUs: GlobalConfig = {
  slug: 'about-us',
  access: { read: () => true },
  admin: { group: 'Pages' },
  fields: [
    text('headline'),
    text('highlight'),
    media('heroImage'),
    copy('heroEyebrow', 'About IT Usaha'),
    copy('bannerLabel', 'About Us'),
    text('backgroundHeading'),
    area('background'),
    copy('visionEyebrow', '01 / Vision'),
    copy('visionHeading', 'Our Vision'),
    area('vision'),
    copy('missionEyebrow', '02 / Mission'),
    copy('missionHeading', 'Our Mission'),
    area('mission'),
    copy('leadershipEyebrow', 'People'),
    text('leadershipHeading'),
    area('leadershipIntro'),
    {
      name: 'leaders',
      type: 'array',
      fields: [
        text('name'),
        text('role'),
        area('bio'),
        media('portrait', 'Professional profile photo'),
      ],
    },
    copy('milestonesEyebrow', 'Our journey'),
    text('milestonesHeading'),
    area('milestonesIntro'),
    {
      name: 'milestones',
      type: 'array',
      fields: [text('year'), area('body'), media('image', 'Milestone photo')],
    },
    seo,
  ],
}

const contactFormFields = [
  copy('nameLabel', 'Name'),
  copy('emailLabel', 'Email Address'),
  copy('phoneLabel', 'Contact No.'),
  copy('companyNameLabel', 'Company Name'),
  copy('companyAddressLabel', 'Company Address'),
  copy('messageLabel', 'Message'),
  copy('privacyLine', 'Your details are handled according to our'),
  copy('successMessage', 'Thank you. Your enquiry has been received.'),
  copy('errorFallback', 'Your message could not be sent. Please try again.'),
  copy('submitLabel', 'Submit Now'),
  copy('submittingLabel', 'Submitting…'),
]

export const ContactUs: GlobalConfig = {
  slug: 'contact-us',
  access: { read: () => true },
  admin: { group: 'Pages' },
  fields: [
    text('headline'),
    copy('heroEyebrow', 'Get in touch'),
    copy('bannerLabel', 'Contact Us'),
    copy('officeEyebrow', 'Our office'),
    text('companyName'),
    text('companyNumber'),
    copy('formEyebrow', 'Start a conversation'),
    text('formTitle'),
    area('formDescription'),
    media('heroImage'),
    { name: 'form', type: 'group', fields: contactFormFields },
    seo,
  ],
}

const policyFields = [
  text('heading'),
  {
    name: 'sections',
    type: 'array',
    fields: [
      text('title'),
      area('intro', false),
      { name: 'items', type: 'array', fields: [area('text')] },
      area('body', false),
    ],
  },
  seo,
] as GlobalConfig['fields']

export const PrivacyPolicy: GlobalConfig = {
  slug: 'privacy-policy',
  access: { read: () => true },
  admin: { group: 'Pages' },
  fields: policyFields,
}

export const TermsAndConditions: GlobalConfig = {
  slug: 'terms-and-conditions',
  access: { read: () => true },
  admin: { group: 'Pages' },
  fields: policyFields,
}

export const EventsPage: GlobalConfig = {
  slug: 'events-page',
  access: { read: () => true },
  admin: { group: 'Pages' },
  fields: [
    text('heading'),
    text('highlight'),
    media('heroImage'),
    copy('eyebrow', 'Events'),
    copy('bannerLabel', 'Events'),
    copy('emptyTitle', 'More events in this category are on the way'),
    copy('emptyMeta', 'Coming soon'),
    copy('viewLabel', 'View Event'),
    seo,
  ],
}

export const ProjectsPage: GlobalConfig = {
  slug: 'projects-page',
  access: { read: () => true },
  admin: { group: 'Pages' },
  fields: [
    text('heading'),
    text('highlight'),
    media('heroImage'),
    copy('eyebrow', 'Projects'),
    copy('bannerLabel', 'Projects'),
    copy('emptyTitle', 'More projects in this status are on the way'),
    copy('emptyMeta', 'Coming soon'),
    copy('detailsLabel', 'Project Details'),
    copy('completedLabel', 'Completed'),
    copy('ongoingLabel', 'Ongoing'),
    copy('clientLabel', 'Client'),
    copy('consultantLabel', 'Data Center Consultant'),
    copy('consultantsLabel', 'Data Center Consultants'),
    copy('scopeLabel', 'Scope of Works'),
    copy('commencementLabel', 'Commencement Date'),
    copy('completionLabel', 'Completion Date'),
    copy('presentLabel', 'Present'),
    {
      name: 'detailCta',
      type: 'group',
      fields: [
        copy(
          'heading',
          'Have a project in mind? We’re here to help you plan, build, and maintain it with confidence',
        ),
        copy('ctaLabel', 'Contact Us'),
        copy('ctaHref', '/contact-us'),
      ],
    },
    seo,
  ],
}

const careerFormFields = [
  copy('nameLabel', 'Name'),
  copy('emailLabel', 'Email Address'),
  copy('phoneLabel', 'Contact No.'),
  copy('vacancyLabel', 'Position Applying For'),
  copy('selectPlaceholder', 'Select a position'),
  copy('introductionLabel', 'Brief Introduction'),
  copy('resumeLabel', 'Upload Résumé (PDF, up to 5MB)'),
  copy('closedLabel', 'Closed'),
  copy('applyButtonLabel', 'Apply for this position'),
  copy('noOpeningsMessage', 'There are no open positions right now. Please check back soon.'),
  copy('privacyLine', 'Your details are handled according to our'),
  copy('successMessage', 'Thank you. Your application has been received.'),
  copy('errorFallback', 'Your application could not be sent. Please try again.'),
  copy('submitLabel', 'Submit Now'),
  copy('submittingLabel', 'Submitting…'),
  copy('nameRequired', 'Enter your name.'),
  copy('emailInvalid', 'Enter a valid email address.'),
  copy('phoneRequired', 'Enter a contact number.'),
  copy('vacancyRequired', 'Select a position.'),
  copy('introductionRequired', 'Tell us a little about yourself.'),
  copy('resumeRequired', 'Attach your résumé.'),
  copy('resumeMustBePdf', 'Résumé must be a PDF.'),
  copy('resumeTooLarge', 'Résumé must be under 5MB.'),
]

export const CareerPage: GlobalConfig = {
  slug: 'career-page',
  access: { read: () => true },
  admin: { group: 'Pages' },
  fields: [
    text('heading'),
    text('highlight'),
    media('heroImage'),
    copy('eyebrow', 'Career'),
    copy('bannerLabel', 'Career'),
    copy('positionsHeading', 'Available Positions'),
    text('applyHeading'),
    area('applyBody'),
    { name: 'form', type: 'group', fields: careerFormFields },
    seo,
  ],
}
