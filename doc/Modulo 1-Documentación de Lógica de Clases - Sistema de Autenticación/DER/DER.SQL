// ==================== SISTEMA DE AUTENTICACIÓN Y ROLES ====================

Table roles {
  id int [pk, increment]
  name varchar(50) [not null, unique]
  description varchar(255)
  level int [not null, default: 1]
  is_system_role boolean [default: false]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    (name) [unique]
    (level)
    (is_system_role)
  }
}

Table permissions {
  id int [pk, increment]
  module varchar(50) [not null]
  action varchar(50) [not null]
  description varchar(255)
  created_at timestamp [default: `now()`]
  
  indexes {
    (module, action) [unique]
    (module)
  }
}

Table role_permissions {
  id int [pk, increment]
  role_id int [not null]
  permission_id int [not null]
  created_at timestamp [default: `now()`]
  
  indexes {
    (role_id, permission_id) [unique]
    (role_id)
    (permission_id)
  }
}

Table users {
  id int [pk, increment]
  uuid varchar(36) [not null, unique]
  name varchar(100) [not null]
  email varchar(100) [not null, unique]
  password varchar(255) [not null]
  role_id int [not null]
  position varchar(100)
  department varchar(100)
  phone varchar(20)
  avatar_url varchar(255)
  timezone varchar(50) [default: 'America/Mexico_City']
  language varchar(10) [default: 'es']
  is_active boolean [default: true]
  last_login timestamp
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    (email) [unique]
    (uuid) [unique]
    (role_id)
    (is_active)
    (department)
  }
}

// ==================== SISTEMA DE MARCAS ====================

Table brand_types {
  id int [pk, increment]
  name varchar(50) [not null, unique]
  description varchar(255)
  created_at timestamp [default: `now()`]
  
  indexes {
    (name) [unique]
  }
}

Table brands {
  id int [pk, increment]
  uuid varchar(36) [not null, unique]
  name varchar(100) [not null]
  commercial_name varchar(100)
  brand_type_id int [not null]
  color varchar(20) [not null, default: '#3B82F6']
  description text
  
  // Información de Contacto
  contact_person varchar(100)
  contact_email varchar(100)
  contact_phone varchar(20)
  website varchar(100)
  
  // Información Fiscal
  rfc varchar(20) [not null]
  tax_address text [not null]
  fiscal_regime varchar(50)
  tax_certificate_url varchar(255)
  
  // Información Bancaria
  bank_name varchar(100)
  bank_account varchar(50)
  clabe varchar(20)
  
  // Métricas y Estado
  credit_limit decimal(15,2) [default: 0]
  current_balance decimal(15,2) [default: 0]
  total_projects int [default: 0]
  total_revenue decimal(15,2) [default: 0]
  average_margin decimal(5,2) [default: 0]
  
  status varchar(20) [default: 'active']
  payment_terms int [default: 30]
  notes text
  logo_url varchar(255)
  
  created_by int [not null]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    (rfc) [unique]
    (uuid) [unique]
    (brand_type_id)
    (status)
    (created_by)
    (name)
    (commercial_name)
  }
}

Table user_brands {
  id int [pk, increment]
  user_id int [not null]
  brand_id int [not null]
  access_level varchar(20) [default: 'view']
  is_default boolean [default: false]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    (user_id, brand_id) [unique]
    (user_id)
    (brand_id)
    (access_level)
  }
}

// ==================== MÓDULO DE PROYECTOS ====================

Table project_statuses {
  id int [pk, increment]
  name varchar(50) [not null, unique]
  color varchar(20)
  description varchar(255)
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
  
  indexes {
    (name) [unique]
    (is_active)
  }
}

Table project_priorities {
  id int [pk, increment]
  name varchar(50) [not null, unique]
  level int [not null]
  color varchar(20)
  description varchar(255)
  created_at timestamp [default: `now()`]
  
  indexes {
    (name) [unique]
    (level)
  }
}

Table project_categories {
  id int [pk, increment]
  name varchar(50) [not null, unique]
  description varchar(255)
  color varchar(20)
  created_at timestamp [default: `now()`]
  
  indexes {
    (name) [unique]
  }
}

Table projects {
  id int [pk, increment]
  uuid varchar(36) [not null, unique]
  code varchar(20) [not null, unique]
  name varchar(200) [not null]
  client_brand_id int [not null]
  
  // Fechas y Duración
  start_date date [not null]
  end_date date [not null]
  duration_days int
  actual_start_date date
  actual_end_date date
  
  // Información Financiera (solo MXN)
  total_amount decimal(15,2) [not null]
  estimated_cost decimal(15,2) [not null]
  actual_cost decimal(15,2) [default: 0]
  estimated_profit decimal(15,2)
  actual_profit decimal(15,2) [default: 0]
  profit_margin decimal(5,2)
  actual_margin decimal(5,2) [default: 0]
  
  // Descripción y Metadatos
  description text
  objectives text
  scope text
  deliverables text
  success_criteria text
  project_category_id int
  tags json
  
  // Equipo del Proyecto
  project_manager_id int [not null]
  account_executive_id int [not null]
  creative_director_id int
  production_manager_id int
  team_members json
  
  // Estado y Prioridad
  project_priority_id int [not null]
  project_status_id int [not null]
  progress_percentage int [default: 0]
  health_status varchar(20) [default: 'on_track']
  
  // Seguimiento
  last_status_update timestamp
  next_review_date date
  completion_date date
  
  created_by int [not null]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    (uuid) [unique]
    (code) [unique]
    (client_brand_id)
    (project_manager_id)
    (project_status_id)
    (project_priority_id)
    (start_date)
    (end_date)
    (created_by)
    (name)
    (health_status)
  }
}

Table project_brands {
  id int [pk, increment]
  project_id int [not null]
  brand_id int [not null]
  participation_percentage decimal(5,2) [not null]
  revenue_share decimal(5,2) [not null]
  shared_resources text
  executive_name varchar(100)
  executive_email varchar(100)
  notes text
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    (project_id, brand_id) [unique]
    (project_id)
    (brand_id)
  }
}

Table project_milestones {
  id int [pk, increment]
  project_id int [not null]
  name varchar(100) [not null]
  description text
  due_date date [not null]
  completed_date date
  status varchar(20) [default: 'pending']
  progress_percentage int [default: 0]
  dependencies json
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    (project_id)
    (due_date)
    (status)
    (completed_date)
  }
}

// ==================== MÓDULO DE CONTRATOS ====================

Table contract_types {
  id int [pk, increment]
  name varchar(50) [not null, unique]
  description varchar(255)
  template_url varchar(255)
  created_at timestamp [default: `now()`]
  
  indexes {
    (name) [unique]
  }
}

Table contract_statuses {
  id int [pk, increment]
  name varchar(50) [not null, unique]
  color varchar(20)
  description varchar(255)
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
  
  indexes {
    (name) [unique]
    (is_active)
  }
}

Table contracts {
  id int [pk, increment]
  uuid varchar(36) [not null, unique]
  project_id int [not null]
  contract_number varchar(50) [not null, unique]
  contract_type_id int [not null]
  version varchar(20) [default: '1.0']
  
  // Fechas del Contrato
  start_date date
  end_date date
  duration_days int
  renewal_date date
  termination_date date
  
  // Información Financiera (solo MXN)
  amount decimal(15,2) [not null]
  tax_percentage decimal(5,2) [default: 0.16]
  tax_amount decimal(15,2)
  total_amount decimal(15,2)
  payment_terms text
  renewal_terms text
  penalty_clauses text
  
  // Documentación
  description text
  terms_conditions text
  contract_file_url varchar(255)
  signed_contract_url varchar(255)
  additional_documents json
  
  // Estado y Firmas
  contract_status_id int [not null]
  signed_by int
  signed_at timestamp
  approved_by int
  approved_at timestamp
  reviewed_by int
  reviewed_at timestamp
  
  created_by int [not null]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    (uuid) [unique]
    (contract_number) [unique]
    (project_id)
    (contract_type_id)
    (contract_status_id)
    (start_date)
    (end_date)
    (signed_by)
    (approved_by)
  }
}

// ==================== MÓDULO FINANCIERO ====================

Table payment_methods {
  id int [pk, increment]
  name varchar(50) [not null, unique]
  description varchar(255)
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
  
  indexes {
    (name) [unique]
    (is_active)
  }
}

Table financial_movements {
  id int [pk, increment]
  uuid varchar(36) [not null, unique]
  project_id int [not null]
  contract_id int
  movement_type varchar(20) [not null]
  category varchar(50) [not null]
  
  // Información de Fechas
  issue_date date [not null]
  due_date date [not null]
  payment_date date
  reconciliation_date date
  
  // Información Financiera (solo MXN)
  amount decimal(15,2) [not null]
  tax_percentage decimal(5,2) [default: 0.16]
  tax_amount decimal(15,2)
  total_amount decimal(15,2)
  
  // Conceptos y Referencias
  description varchar(200) [not null]
  detailed_description text
  invoice_number varchar(50)
  reference_number varchar(50)
  payment_method_id int
  bank_reference varchar(100)
  
  // Documentación
  document_url varchar(255)
  payment_evidence_url varchar(255)
  additional_documents json
  
  // Estado y Seguimiento
  status varchar(20) [default: 'pending']
  payment_status varchar(20) [default: 'unpaid']
  reconciliation_status varchar(20) [default: 'pending']
  notes text
  
  created_by int [not null]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    (uuid) [unique]
    (project_id)
    (movement_type)
    (status)
    (due_date)
    (payment_date)
    (invoice_number)
    (issue_date)
    (category)
  }
}

Table budget_items {
  id int [pk, increment]
  project_id int [not null]
  category varchar(50) [not null]
  description varchar(200) [not null]
  estimated_amount decimal(15,2) [not null]
  actual_amount decimal(15,2) [default: 0]
  status varchar(20) [default: 'planned']
  notes text
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    (project_id)
    (category)
    (status)
  }
}

// ==================== MÓDULO DE PROVEEDORES ====================

Table supplier_categories {
  id int [pk, increment]
  name varchar(50) [not null, unique]
  description varchar(255)
  created_at timestamp [default: `now()`]
  
  indexes {
    (name) [unique]
  }
}

Table suppliers {
  id int [pk, increment]
  uuid varchar(36) [not null, unique]
  name varchar(100) [not null]
  commercial_name varchar(100)
  supplier_category_id int [not null]
  color varchar(20) [default: '#10B981']
  
  // Información de Contacto
  contact_person varchar(100)
  contact_email varchar(100)
  contact_phone varchar(20)
  website varchar(100)
  service_description text
  
  // Información Fiscal
  rfc varchar(20) [not null]
  tax_address text [not null]
  fiscal_regime varchar(50)
  tax_certificate_url varchar(255)
  
  // Información Bancaria
  bank_name varchar(100)
  bank_account varchar(50)
  clabe varchar(20)
  payment_terms int [default: 30]
  
  // Evaluación y Estado
  quality_rating decimal(3,2) [default: 0]
  delivery_rating decimal(3,2) [default: 0]
  cost_rating decimal(3,2) [default: 0]
  overall_rating decimal(3,2) [default: 0]
  status varchar(20) [default: 'active']
  is_preferred boolean [default: false]
  
  // Métricas
  total_projects int [default: 0]
  total_amount decimal(15,2) [default: 0]
  pending_balance decimal(15,2) [default: 0]
  
  notes text
  created_by int [not null]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    (uuid) [unique]
    (rfc) [unique]
    (supplier_category_id)
    (status)
    (is_preferred)
    (name)
    (commercial_name)
  }
}

// ==================== SISTEMA DE ARCHIVOS ====================

Table document_categories {
  id int [pk, increment]
  name varchar(50) [not null, unique]
  description varchar(255)
  created_at timestamp [default: `now()`]
  
  indexes {
    (name) [unique]
  }
}

Table project_documents {
  id int [pk, increment]
  project_id int [not null]
  document_category_id int [not null]
  name varchar(200) [not null]
  description text
  file_url varchar(255) [not null]
  file_size bigint
  file_type varchar(50)
  version varchar(20) [default: '1.0']
  is_public boolean [default: false]
  uploaded_by int [not null]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    (project_id)
    (document_category_id)
    (uploaded_by)
    (file_type)
    (is_public)
  }
}

// ==================== RELACIONES ====================

// Roles y Permisos
Ref: role_permissions.role_id > roles.id
Ref: role_permissions.permission_id > permissions.id

// Usuarios
Ref: users.role_id > roles.id

// Marcas
Ref: brands.brand_type_id > brand_types.id
Ref: brands.created_by > users.id
Ref: user_brands.user_id > users.id
Ref: user_brands.brand_id > brands.id

// Proyectos
Ref: projects.client_brand_id > brands.id
Ref: projects.project_category_id > project_categories.id
Ref: projects.project_status_id > project_statuses.id
Ref: projects.project_priority_id > project_priorities.id
Ref: projects.project_manager_id > users.id
Ref: projects.account_executive_id > users.id
Ref: projects.creative_director_id > users.id
Ref: projects.production_manager_id > users.id
Ref: projects.created_by > users.id

Ref: project_brands.project_id > projects.id
Ref: project_brands.brand_id > brands.id

Ref: project_milestones.project_id > projects.id

// Contratos
Ref: contracts.project_id > projects.id
Ref: contracts.contract_type_id > contract_types.id
Ref: contracts.contract_status_id > contract_statuses.id
Ref: contracts.signed_by > users.id
Ref: contracts.approved_by > users.id
Ref: contracts.reviewed_by > users.id
Ref: contracts.created_by > users.id

// Finanzas
Ref: financial_movements.project_id > projects.id
Ref: financial_movements.contract_id > contracts.id
Ref: financial_movements.payment_method_id > payment_methods.id
Ref: financial_movements.created_by > users.id

Ref: budget_items.project_id > projects.id

// Proveedores
Ref: suppliers.supplier_category_id > supplier_categories.id
Ref: suppliers.created_by > users.id

// Documentos
Ref: project_documents.project_id > projects.id
Ref: project_documents.document_category_id > document_categories.id
Ref: project_documents.uploaded_by > users.id