import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { JobDetails } from '../../types/api'

export type JobDetailsFormValues = JobDetails

interface JobDetailsFormProps {
  register: UseFormRegister<JobDetailsFormValues>
  errors: FieldErrors<JobDetailsFormValues>
}

function JobDetailsForm({ register, errors }: JobDetailsFormProps) {
  return (
    <div className="job-details-form">
      <div className="section-intro-row">
        <h3 className="subsection-title">Job details</h3>
        <span className="label-mono muted-copy">01—04</span>
      </div>
      <div className="form-stack">
        <label className="form-field">
          <span className="form-field__label">Job title</span>
          <input className="form-field__control" type="text" placeholder="e.g. Customer Support Associate" {...register('jobTitle', { required: 'Add a job title.' })} aria-invalid={Boolean(errors.jobTitle)} aria-describedby={errors.jobTitle ? 'job-title-error' : undefined} />
          {errors.jobTitle ? <span className="form-field__error" id="job-title-error">{errors.jobTitle.message}</span> : null}
        </label>
        <label className="form-field">
          <span className="form-field__label">Company name</span>
          <input className="form-field__control" type="text" placeholder="e.g. Northline Services" {...register('companyName', { required: 'Add the company name when known.' })} aria-invalid={Boolean(errors.companyName)} aria-describedby={errors.companyName ? 'company-name-error' : undefined} />
          {errors.companyName ? <span className="form-field__error" id="company-name-error">{errors.companyName.message}</span> : null}
        </label>
        <label className="form-field">
          <span className="form-field__label">Company website <span className="form-field__optional">optional</span></span>
          <input className="form-field__control" type="url" placeholder="https://company.example" {...register('companyWebsite', { pattern: { value: /^$|^https?:\/\/.+/, message: 'Use a full website URL.' } })} aria-invalid={Boolean(errors.companyWebsite)} aria-describedby={errors.companyWebsite ? 'website-error' : undefined} />
          {errors.companyWebsite ? <span className="form-field__error" id="website-error">{errors.companyWebsite.message}</span> : null}
        </label>
        <label className="form-field">
          <span className="form-field__label">Recruiter information <span className="form-field__optional">optional</span></span>
          <input className="form-field__control" type="text" placeholder="Name, email, or contact channel" {...register('recruiterInformation')} />
        </label>
      </div>
    </div>
  )
}

export default JobDetailsForm
