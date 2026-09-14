# Terrier-Rouge Connect

# MASTER PROMPT — TERRIER-ROUGE COMMUNE

Construye una plataforma web moderna llamada **TERRIER-ROUGE COMMUNE**, destinada a la gestión, publicación y seguimiento transparente de proyectos de desarrollo de la Commune de Terrier-Rouge, Nord-Est, Haïti.

La plataforma debe permitir que un administrador gestione proyectos públicos y que los ciudadanos/donadores puedan consultar esos proyectos, visualizar su presupuesto y progreso y realizar apoyo económico mediante un sistema de donación manual basado en Zelle.

IMPORTANTE:

* NO crear módulo de voluntarios.
* NO crear funciones de voluntariado.
* NO crear donación de materiales.
* NO crear marketplace.
* NO crear funciones de contratación.
* El rol Donateur solamente debe poder:

  1. Ver proyectos públicos.
  2. Consultar presupuesto y progreso.
  3. Apoyar económicamente.
* Zelle será un método de pago MANUAL, no una integración automática con la API de Zelle.
* El número/email de Zelle debe poder configurarse manualmente desde el panel administrativo.
* La plataforma debe estar preparada para crecer posteriormente.

==================================================

1. IDENTIDAD DE LA PLATAFORMA
   ==================================================

Nombre:
TERRIER-ROUGE COMMUNE

Subtítulo:
Plateforme de gestion et de transparence communautaire

Ubicación:
Terrier-Rouge, Nord-Est, Haïti

Idiomas:

* Français como idioma principal
* Kreyòl haïtien
* Español opcional para una futura versión

Diseño:

* Institucional
* Moderno
* Profesional
* Transparente
* Comunitario
* Fácil de utilizar desde teléfonos móviles

Evitar apariencia de una aplicación bancaria.

La plataforma debe transmitir:

* Transparence
* Développement
* Confiance
* Participation citoyenne
* Responsabilité

==================================================
2. ROLES DEL SISTEMA
====================

Crear solamente dos roles principales:

ADMINISTRATEUR
DONATEUR

No crear ningún rol "VOLONTAIRE".

---

## ADMINISTRATEUR

El administrador puede:

* Iniciar sesión.
* Acceder al Dashboard.
* Crear proyectos.
* Editar proyectos.
* Eliminar proyectos.
* Publicar/despublicar proyectos.
* Cambiar estado del proyecto.
* Agregar imágenes.
* Agregar videos.
* Agregar ubicación.
* Definir presupuesto.
* Registrar fondos recibidos.
* Registrar gastos.
* Actualizar progreso.
* Publicar actualizaciones.
* Gestionar donaciones.
* Ver donaciones pendientes.
* Confirmar donaciones.
* Rechazar donaciones.
* Configurar información de Zelle.
* Gestionar categorías.
* Ver estadísticas.
* Gestionar usuarios Donateur.
* Gestionar configuración general.

---

## DONATEUR

El Donateur NO necesita un dashboard complejo.

Debe poder:

1. Ver proyectos públicos.
2. Abrir un proyecto.
3. Consultar presupuesto.
4. Consultar progreso.
5. Consultar monto recaudado.
6. Consultar actualizaciones.
7. Ver imágenes/videos.
8. Pulsar "Appuyer financièrement".
9. Ver las instrucciones de Zelle.
10. Registrar una donación realizada manualmente.

No permitir al Donateur:

* Crear proyectos.
* Editar proyectos.
* Ver proyectos privados.
* Modificar presupuesto.
* Modificar progreso.
* Gestionar otros usuarios.
* Crear voluntariados.
* Ofrecer servicios.
* Donar materiales.

==================================================
3. PÁGINA DE INICIO
===================

Crear una homepage institucional moderna.

Hero:

TERRIER-ROUGE COMMUNE

"Ensemble pour le développement de notre commune."

Texto:

"Découvrez les projets de développement de Terrier-Rouge, suivez leur progression et contribuez à leur réalisation."

Botones:

[Voir les projets]

[Appuyer un projet]

Mostrar debajo:

* Projets actifs
* Projets réalisés
* Montant collecté
* Progression globale

Crear una sección:

"Nos projets"

Mostrar tarjetas de proyectos.

Cada tarjeta debe mostrar:

* Imagen
* Nombre
* Categoría
* Estado
* Presupuesto
* Monto recaudado
* Barra de progreso
* Porcentaje
* Botón "Voir le projet"

==================================================
4. CATEGORÍAS DE PROYECTOS
==========================

Crear categorías:

Éducation
Santé
Eau potable
Routes et infrastructures
Électricité
Environnement
Agriculture
Pêche
Sport
Développement économique
Assainissement
Social
Technologie
Autres

El administrador podrá crear nuevas categorías.

==================================================
5. ESTADOS DE PROYECTOS
=======================

Crear los siguientes estados:

PLANIFIÉ

EN COURS

SUSPENDU

TERMINÉ

ANNULÉ

Cada estado debe tener una etiqueta visual diferente.

==================================================
6. CREACIÓN DE PROYECTOS
========================

Crear formulario:

Nom du projet

Slug

Description courte

Description complète

Catégorie

Localisation

Latitude

Longitude

Budget prévu

Montant initial collecté

Date de début

Date prévue de fin

Statut

Pourcentage de progression

Image principale

Galerie d'images

Vidéo

Projet public:
[ON/OFF]

Crear validación de campos.

El presupuesto debe aceptar valores monetarios.

Permitir elegir moneda:

USD
HTG

Guardar la moneda del proyecto.

==================================================
7. PÁGINA INDIVIDUAL DEL PROYECTO
=================================

Crear una página pública profesional:

Título

Imagen principal

Categoría

Estado

Ubicación

Descripción

Presupuesto

Monto recaudado

Monto restante

Porcentaje de progreso

Fecha de inicio

Fecha estimada de finalización

Galería

Video

Actualizaciones

Botón:

[APPUIER FINANCIÈREMENT]

Crear una sección visual:

OBJECTIF FINANCIER

$25,000

COLLECTÉ

$14,750

RESTANT

$10,250

PROGRESSION

59%

Utilizar una barra de progreso.

==================================================
8. SISTEMA DE ACTUALIZACIONES
=============================

El administrador puede publicar actualizaciones.

Cada actualización:

Titre

Description

Date

Images

Video opcional

Porcentaje de progreso

Ejemplo:

"Les travaux de rénovation de l'école ont commencé."

Mostrar las actualizaciones cronológicamente.

==================================================
9. SISTEMA DE DONACIONES
========================

IMPORTANTE:

No integrar Zelle automáticamente.

Crear un sistema de donación MANUAL.

Flujo:

Donateur abre un proyecto.

Pulsa:

[APPUIER FINANCIÈREMENT]

Mostrar:

Nom du projet

Budget

Montant collecté

Progression

Luego formulario:

Nom complet

Email

Montant

Devise

USD / HTG

Référence du paiement Zelle

Message facultatif

Checkbox:

"Je confirme avoir effectué le paiement."

Botón:

[ENVOYER MA CONTRIBUTION]

Después mostrar:

"Votre contribution a été enregistrée et sera vérifiée par l'administration."

Estado inicial:

EN ATTENTE

==================================================
10. CONFIGURACIÓN ZELLE
=======================

Crear:

ADMIN → PARAMÈTRES → PAIEMENTS

Sección:

ZELLE

Campos:

Zelle Email

Zelle Phone

Nom du bénéficiaire

Instructions

Actif:
ON/OFF

El administrador puede cambiar estos datos en cualquier momento.

Ejemplo:

Zelle:
[donations@example.com](mailto:donations@example.com)

Bénéficiaire:
Terrier-Rouge Development Project

Instructions:

"Envoyez votre contribution via Zelle puis indiquez la référence du paiement dans le formulaire."

NO mostrar datos ficticios como datos reales.

Utilizar valores de ejemplo solamente durante desarrollo.

==================================================
11. GESTIÓN DE DONACIONES
=========================

Crear:

ADMIN → DONATIONS

Tabla:

ID

Projet

Donateur

Montant

Devise

Référence Zelle

Date

Statut

Actions

Estados:

EN ATTENTE

CONFIRMÉE

REJETÉE

El administrador puede:

Voir

Confirmer

Rejeter

Cuando una donación sea confirmada:

* Actualizar automáticamente el monto recaudado del proyecto.
* Recalcular porcentaje financiero.
* Registrar fecha de confirmación.
* Crear registro de auditoría.

NO sumar automáticamente una donación que esté EN ATTENTE.

==================================================
12. CÁLCULO DEL PROGRESO
========================

Separar:

PROGRESO FINANCIERO

PROGRESO DU PROJET

El administrador puede actualizar manualmente el progreso físico del proyecto.

Ejemplo:

Budget:
$20,000

Collecté:
$12,000

Progression financière:
60%

Progression du projet:
45%

Mostrar ambos indicadores separadamente.

==================================================
13. DASHBOARD ADMINISTRADOR
===========================

Crear dashboard profesional.

Mostrar:

Total projets

Projets actifs

Projets terminés

Projets suspendus

Total donations

Donations en attente

Montant collecté

Progression moyenne

Crear gráficos:

* Donations par mois
* Projets par catégorie
* Progression des projets
* Fonds collectés

Crear tarjetas KPI.

==================================================
14. ADMIN → PROJETS
===================

Tabla:

Projet

Catégorie

Budget

Collecté

Progression

Statut

Public

Date

Actions

Acciones:

Voir

Modifier

Dupliquer

Publier

Dépublier

Supprimer

==================================================
15. ADMIN → DONATIONS
=====================

Crear tabla con filtros:

Projet

Statut

Date

Devise

Montant

Buscar por:

Nom

Email

Référence Zelle

Crear exportación CSV.

==================================================
16. ADMIN → UTILISATEURS
========================

Mostrar:

Nom

Email

Date d'inscription

Nombre de contributions

Montant total

Statut

El administrador puede:

Activer

Désactiver

Voir profil

No permitir que un Donateur se convierta en Administrateur desde la interfaz pública.

==================================================
17. AUTENTICACIÓN
=================

Utilizar Supabase Auth.

Login:

Email

Password

Forgot password

Crear protección de rutas.

ADMIN:

/admin

DONATEUR:

/projects

Los usuarios no autenticados pueden consultar proyectos públicos.

El panel administrativo debe requerir autenticación.

==================================================
18. BASE DE DATOS SUPABASE
==========================

Crear PostgreSQL mediante Supabase.

Tablas principales:

profiles

roles

projects

project_categories

project_updates

project_images

donations

payment_settings

audit_logs

site_settings

project_expenses

---

## profiles

id UUID PRIMARY KEY

full_name

email

role

avatar_url

status

created_at

updated_at

---

## project_categories

id UUID PRIMARY KEY

name

slug

description

created_at

---

## projects

id UUID PRIMARY KEY

title

slug

short_description

description

category_id

location

latitude

longitude

budget

currency

amount_collected

project_progress

financial_progress

start_date

expected_end_date

status

featured_image

video_url

is_public

created_by

created_at

updated_at

---

## project_updates

id UUID PRIMARY KEY

project_id

title

content

progress

created_by

created_at

---

## project_images

id UUID PRIMARY KEY

project_id

image_url

caption

created_at

---

## donations

id UUID PRIMARY KEY

project_id

donor_id

donor_name

donor_email

amount

currency

zelle_reference

message

status

confirmed_at

confirmed_by

created_at

updated_at

---

## payment_settings

id UUID PRIMARY KEY

zelle_email

zelle_phone

beneficiary_name

instructions

is_active

updated_at

---

## project_expenses

id UUID PRIMARY KEY

project_id

description

amount

currency

expense_date

receipt_url

created_by

created_at

---

## audit_logs

id UUID PRIMARY KEY

user_id

action

entity_type

entity_id

metadata

created_at

---

## site_settings

id UUID PRIMARY KEY

site_name

description

logo_url

contact_email

phone

address

social_links

updated_at

==================================================
19. SEGURIDAD SUPABASE
======================

Implementar Row Level Security.

Reglas:

PUBLIC:

Puede leer proyectos donde:

is_public = true

Puede leer categorías públicas.

Puede leer actualizaciones de proyectos públicos.

DONATEUR:

Puede crear sus propias solicitudes de donación.

Puede consultar únicamente sus propias donaciones.

No puede modificar:

projects

payment_settings

project_expenses

audit_logs

ADMIN:

Puede administrar todo.

Nunca exponer:

service_role_key

credenciales privadas

secretos

variables de entorno

==================================================
20. STORAGE
===========

Crear buckets:

project-images

project-videos

project-documents

avatars

Configurar permisos correctamente.

Las imágenes públicas de proyectos deben poder visualizarse desde la web.

Los documentos administrativos pueden tener acceso restringido.

==================================================
21. TRANSPARENCIA
=================

Crear una página:

/transparence

Mostrar:

Total projets

Budget total

Montant collecté

Montant dépensé

Projets terminés

Projets en cours

Crear gráficos públicos.

Mostrar una lista de proyectos.

Cada proyecto debe permitir consultar:

Budget

Collecté

Dépenses enregistrées

Progression

Updates

Photos

==================================================
22. PÁGINA "À PROPOS"
=====================

Crear una página institucional:

"À propos de Terrier-Rouge Commune"

Explicar que la plataforma sirve para:

* présenter les projets
* suivre leur progression
* renforcer la transparence
* faciliter la contribution financière

No inventar información oficial sobre la mairie, autoridades o instituciones.

Utilizar texto placeholder claramente marcado si faltan datos oficiales.

==================================================
23. RESPONSIVE DESIGN
=====================

La plataforma debe funcionar perfectamente en:

Desktop

Tablet

iPhone

Android

Diseñar primero pensando en mobile.

Navbar mobile:

Accueil

Projets

Transparence

À propos

Connexion

==================================================
24. DISEÑO VISUAL
=================

Crear una identidad visual institucional inspirada en:

Haïti

Terrier-Rouge

Nord-Est

Desarrollo comunitario

Utilizar:

Azul profundo

Verde

Blanco

Detalles dorados discretos

No utilizar demasiados colores.

Tipografía:

Inter

o una fuente moderna equivalente.

Cards:

Border radius moderado

Sombras suaves

Espacios amplios

Diseño limpio.

Utilizar iconos Lucide.

==================================================
25. MAPA
========

En la página del proyecto mostrar un mapa cuando existan:

latitude

longitude

Usar Mapbox o una solución compatible.

Si no existen coordenadas:

No mostrar mapa vacío.

Mostrar solamente la ubicación textual.

==================================================
26. NOTIFICACIONES
==================

Preparar estructura para notificaciones.

Cuando:

Donación enviada

→ enviar confirmación al Donateur.

Donación confirmada

→ enviar notificación al Donateur.

Donación rechazada

→ enviar notificación al Donateur.

Proyecto actualizado

→ preparar estructura para futuras notificaciones.

Si todavía no existe proveedor de email configurado, crear una capa de servicio preparada para Resend u otro proveedor, pero no insertar API keys ficticias.

==================================================
27. AUDITORÍA
=============

Registrar acciones administrativas:

CREATE_PROJECT

UPDATE_PROJECT

DELETE_PROJECT

PUBLISH_PROJECT

UNPUBLISH_PROJECT

CONFIRM_DONATION

REJECT_DONATION

UPDATE_PROJECT_PROGRESS

ADD_PROJECT_UPDATE

UPDATE_ZELLE_SETTINGS

LOGIN

Registrar:

Usuario

Acción

Fecha

Entidad

ID

Metadata

==================================================
28. SEO
=======

Crear SEO para:

Homepage

Projects

Individual project

Transparency

About

Cada proyecto debe tener:

Title

Meta description

Open Graph image

Canonical URL

URLs amigables:

/projects

/projects/nom-du-projet

/transparence

/a-propos

==================================================
29. ADMINISTRACIÓN DE CONTENIDO
===============================

El administrador debe poder gestionar el contenido sin tocar código.

Todo debe ser editable desde el dashboard.

No hardcodear:

Nombre de proyectos

Presupuestos

Donaciones

Zelle

Categorías

Actualizaciones

Textos institucionales

==================================================
30. DATOS DE DEMOSTRACIÓN
=========================

Crear algunos proyectos DEMO únicamente para visualizar el diseño.

IMPORTANTE:

Marcarlos claramente como:

DEMO

No presentarlos como proyectos reales de Terrier-Rouge.

Ejemplos:

"Projet Démo — Réhabilitation d'une école"

"Projet Démo — Eau potable"

"Projet Démo — Route communale"

No inventar autoridades, presupuestos oficiales o proyectos reales.

==================================================
31. EXPERIENCIA DEL DONATEUR
============================

La experiencia debe ser extremadamente simple.

HOME

↓

PROJETS

↓

SELECCIONAR PROYECTO

↓

VER PRESUPUESTO + PROGRESO

↓

APPUIER FINANCIÈREMENT

↓

VER DATOS ZELLE

↓

REALIZAR PAGO

↓

REGISTRAR CONTRIBUCIÓN

↓

CONFIRMATION

No introducir pasos innecesarios.

==================================================
32. EXPERIENCIA DEL ADMINISTRADOR
=================================

LOGIN

↓

DASHBOARD

↓

PROJETS

↓

NOUVEAU PROJET

↓

PUBLICAR

↓

RECIBIR DONACIÓN

↓

DONATION EN ATTENTE

↓

VERIFICAR ZELLE

↓

CONFIRMER

↓

ACTUALIZAR MONTO

↓

ACTUALIZAR PROGRESO

↓

PUBLICAR UPDATE

==================================================
33. REGLAS IMPORTANTES
======================

1. No crear módulo de voluntarios.

2. No crear funciones de voluntariado.

3. No crear marketplace.

4. No crear sistema de donación de materiales.

5. No inventar integración automática con Zelle.

6. Zelle debe funcionar mediante configuración manual.

7. Una donación pendiente NO debe aumentar el total recaudado.

8. Solamente una donación CONFIRMÉE debe aumentar amount_collected.

9. El progreso físico del proyecto y el progreso financiero deben ser independientes.

10. Solamente administradores pueden confirmar donaciones.

11. Solamente administradores pueden modificar proyectos.

12. Los proyectos privados no deben aparecer públicamente.

13. Los usuarios públicos pueden consultar proyectos sin crear cuenta.

14. No exponer secretos de Supabase.

15. No colocar API keys directamente en el código.

16. Utilizar variables de entorno.

17. Aplicar RLS correctamente.

18. Validar todos los formularios.

19. Evitar duplicación de registros.

20. Mantener arquitectura preparada para futuras aplicaciones móviles.

==================================================
34. ARQUITECTURA
================

Usar:

Frontend:
React / Next.js

UI:
Tailwind CSS

Components:
shadcn/ui

Icons:
Lucide

Backend:
Supabase

Database:
PostgreSQL

Authentication:
Supabase Auth

Storage:
Supabase Storage

Charts:
Recharts

Maps:
Mapbox

Email:
Preparar integración con Resend.

==================================================
35. ESTRUCTURA DE RUTAS
=======================

/

/projects

/projects/[slug]

/transparence

/a-propos

/login

/register

/forgot-password

/account

/admin

/admin/projects

/admin/projects/new

/admin/projects/[id]

/admin/donations

/admin/users

/admin/categories

/admin/expenses

/admin/settings

/admin/settings/payments

/admin/audit-logs

==================================================
36. COMPONENTES PRINCIPALES
===========================

Navbar

Footer

Hero

ProjectCard

ProjectGrid

ProjectProgress

FinancialProgress

DonationModal

ZelleInstructions

DonationForm

DonationStatus

ProjectGallery

ProjectUpdateTimeline

ProjectMap

TransparencyDashboard

AdminSidebar

AdminHeader

KpiCard

DonationTable

ProjectTable

UserTable

ExpenseTable

AuditLogTable

==================================================
37. MOBILE
==========

Crear una experiencia excelente en teléfonos.

El botón:

APPUIER FINANCIÈREMENT

debe ser muy visible.

Las estadísticas deben convertirse automáticamente en cards verticales.

El dashboard administrativo debe tener navegación móvil.

==================================================
38. RESULTADO FINAL ESPERADO
============================

Quiero una plataforma funcional, no solamente un prototipo visual.

Debe incluir:

* Frontend funcional
* Supabase
* Base de datos
* Authentication
* Roles
* RLS
* CRUD de proyectos
* CRUD de categorías
* Actualizaciones
* Galería
* Donaciones
* Zelle manual
* Confirmación administrativa
* Gastos
* Dashboard
* Transparencia
* Auditoría
* Responsive design
* SEO
* Storage

El código debe ser limpio, modular y escalable.

No crear funcionalidades que no hayan sido solicitadas.

Primero construir el núcleo funcional.

Después mejorar el diseño visual sin romper las funcionalidades.

Antes de finalizar:

* Verificar todas las rutas.
* Verificar autenticación.
* Verificar permisos.
* Verificar RLS.
* Verificar creación de proyectos.
* Verificar publicación.
* Verificar donaciones.
* Verificar confirmación.
* Verificar cálculo financiero.
* Verificar progreso.
* Verificar configuración Zelle.
* Verificar responsive.
* Verificar que un Donateur no pueda acceder al panel administrativo.

El resultado debe sentirse como una plataforma profesional de gestión y transparencia para una commune, no como una plantilla genérica.

==================================================
FIN DEL MASTER PROMPT
=====================

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f4d5e1f5-f140-4d70-b010-0be19828688d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
