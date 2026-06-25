# Create Department - Cross-Module Isolation Test Plan

## Application Overview

This test plan covers the Create Department feature on the Citizen Connect Cluj (Registru Digital) platform. Departments (Compartimente) are managed via the admin settings panel under three independent sub-modules: Flux digital (/compartmentsreg), Dosar digital (/compartmentsdoc), and Registratură (/compartmentsone). Each sub-module has its own isolated department list. The "Adaugă compartiment" (Add Department) form requires: Department Name (required), Department Type (required, one of: Direcție nivel 1 / Serviciu nivel 2 / Departament nivel 3), Included In (optional parent department), and Description (required). A Search field on each sub-module list page filters results in real-time as the user types. The test plan validates happy-path creation, cross-module isolation, search functionality, and negative/edge cases.

## Test Scenarios

### 1. Create Department in Flux Digital Sub-Module

**Seed:** `tests/seed.spec.ts`

#### 1.1. Successfully create a department in the Flux Digital sub-module

**File:** `tests/create-department/flux-digital-create.spec.ts`

**Steps:**
  1. Log in as admin and open the admin settings panel by clicking the 'Deschideți setările de administrator' button in the top navigation bar.
    - expect: The admin settings side menu appears with the 'Compartimente' option visible.
  2. Click the 'Compartimente' menu item in the admin settings panel.
    - expect: The Compartimente list page opens at /compartmentsreg, defaulting to the 'Flux digital' tab.
  3. Verify the 'Flux digital' tab is active and the department list is displayed with a count label (e.g., 'Compartimente (N)').
    - expect: The Flux digital tab is highlighted/active. A table with columns: Nume compartiment, Tip, Inclus în, Funcționari, Ultima editare, Status is displayed.
  4. Click the 'Adaugă compartiment' button at the top right of the page.
    - expect: The browser navigates to /compartmentsreg/addcompartment. The Add Department form opens showing the label 'Flux digital' as the module context.
  5. In the 'Nume compartiment' field, enter the unique name 'Dept_FluxDigital_Test_001'.
    - expect: The text is accepted in the name field.
  6. Click the 'Tip compartiment' dropdown and select 'Direcție (nivel 1)'.
    - expect: The dropdown closes and 'Direcție (nivel 1)' is displayed as the selected type.
  7. In the 'Descriere compartiment' field, enter the description 'Test department for Flux Digital module'.
    - expect: The description text is accepted. The 'Salvează' (Save) button becomes enabled.
  8. Click the 'Salvează' button.
    - expect: The form is submitted successfully. The application navigates back to the Flux digital department list at /compartmentsreg. A success notification or confirmation is displayed. The newly created department 'Dept_FluxDigital_Test_001' appears in the department list.

#### 1.2. Verify that Flux Digital department is visible via Search in Flux Digital sub-module

**File:** `tests/create-department/flux-digital-search.spec.ts`

**Steps:**
  1. Prerequisite: The department 'Dept_FluxDigital_Test_001' has been created in the Flux Digital sub-module (via API or prior test). Navigate to /compartmentsreg.
    - expect: The Flux digital department list page is loaded.
  2. Locate the 'Caută' (Search) text input field in the Filtre (Filters) panel.
    - expect: The search text box is visible and empty.
  3. Type 'Dept_FluxDigital_Test_001' into the search field.
    - expect: The department list filters in real time. The count label updates to 'Compartimente (1)'. Only the row for 'Dept_FluxDigital_Test_001' is displayed in the table.
  4. Verify the displayed row shows the correct department name, type ('direcție'), and status ('activ').
    - expect: The row contains: Name = 'Dept_FluxDigital_Test_001', Tip = 'direcție', Status = 'activ'.
  5. Clear the search field by clicking the 'Șterge filtrele' (Clear filters) button.
    - expect: The search field is cleared. The full department list is restored with the original count.

### 2. Create Department in Dosar Digital Sub-Module

**Seed:** `tests/seed.spec.ts`

#### 2.1. Successfully create a department in the Dosar Digital sub-module

**File:** `tests/create-department/dosar-digital-create.spec.ts`

**Steps:**
  1. Log in as admin and open the admin settings panel by clicking 'Deschideți setările de administrator'.
    - expect: The admin settings side menu appears.
  2. Click the 'Compartimente' menu item in the admin settings panel.
    - expect: The Compartimente page opens, defaulting to the Flux digital tab at /compartmentsreg.
  3. Click the 'Dosar digital' tab link.
    - expect: The browser navigates to /compartmentsdoc. The 'Dosar digital' tab is now active. The department list shows only Dosar digital departments.
  4. Click the 'Adaugă compartiment' button.
    - expect: The browser navigates to /compartmentsdoc/addcompartment. The Add Department form opens showing 'Dosar digital' as the module context label.
  5. In the 'Nume compartiment' field, enter the unique name 'Dept_DosarDigital_Test_001'.
    - expect: The text is accepted in the name field.
  6. Click the 'Tip compartiment' dropdown and select 'Serviciu (nivel 2)'.
    - expect: 'Serviciu (nivel 2)' is displayed as the selected type.
  7. In the 'Descriere compartiment' field, enter 'Test department for Dosar Digital module'.
    - expect: The description is accepted. The 'Salvează' button becomes enabled.
  8. Click the 'Salvează' button.
    - expect: The form submits successfully. The application navigates back to /compartmentsdoc. The newly created 'Dept_DosarDigital_Test_001' appears in the Dosar digital department list.

#### 2.2. Verify that Dosar Digital department is visible via Search in Dosar Digital sub-module

**File:** `tests/create-department/dosar-digital-search.spec.ts`

**Steps:**
  1. Prerequisite: 'Dept_DosarDigital_Test_001' has been created in the Dosar Digital sub-module. Navigate to /compartmentsdoc.
    - expect: The Dosar digital department list page is loaded.
  2. Type 'Dept_DosarDigital_Test_001' into the 'Caută' (Search) field.
    - expect: The list filters in real time. The count label updates to 'Compartimente (1)'. Only 'Dept_DosarDigital_Test_001' is shown.
  3. Verify the row shows the correct department name, type ('serviciu'), and status ('activ').
    - expect: Row data is correct: Name = 'Dept_DosarDigital_Test_001', Tip = 'serviciu', Status = 'activ'.
  4. Click 'Șterge filtrele' to clear the search.
    - expect: The search is cleared and the full Dosar digital department list is restored.

### 3. Create Department in Registratură Sub-Module

**Seed:** `tests/seed.spec.ts`

#### 3.1. Successfully create a department in the Registratură sub-module

**File:** `tests/create-department/registratura-create.spec.ts`

**Steps:**
  1. Log in as admin and open the admin settings panel by clicking 'Deschideți setările de administrator'.
    - expect: The admin settings side menu appears.
  2. Click 'Compartimente' in the admin settings panel.
    - expect: The Compartimente page opens at /compartmentsreg, defaulting to the Flux digital tab.
  3. Click the 'Registratură' tab link.
    - expect: The browser navigates to /compartmentsone. The 'Registratură' tab is active. Only Registratură departments are listed.
  4. Click the 'Adaugă compartiment' button.
    - expect: The browser navigates to /compartmentsone/addcompartment. The Add Department form opens showing 'Registratură' as the module context label.
  5. In the 'Nume compartiment' field, enter the unique name 'Dept_Registratura_Test_001'.
    - expect: The text is accepted in the name field.
  6. Click the 'Tip compartiment' dropdown and select 'Departament (nivel 3)'.
    - expect: 'Departament (nivel 3)' is displayed as the selected type.
  7. In the 'Descriere compartiment' field, enter 'Test department for Registratura module'.
    - expect: The description is accepted. The 'Salvează' button becomes enabled.
  8. Click the 'Salvează' button.
    - expect: The form submits successfully. The application navigates back to /compartmentsone. The newly created 'Dept_Registratura_Test_001' appears in the Registratură department list.

#### 3.2. Verify that Registratură department is visible via Search in Registratură sub-module

**File:** `tests/create-department/registratura-search.spec.ts`

**Steps:**
  1. Prerequisite: 'Dept_Registratura_Test_001' has been created in the Registratură sub-module. Navigate to /compartmentsone.
    - expect: The Registratură department list page is loaded.
  2. Type 'Dept_Registratura_Test_001' into the 'Caută' (Search) field.
    - expect: The list filters in real time. The count label updates to 'Compartimente (1)'. Only 'Dept_Registratura_Test_001' is shown.
  3. Verify the row shows the correct department name, type ('departament'), and status ('activ').
    - expect: Row data is correct: Name = 'Dept_Registratura_Test_001', Tip = 'departament', Status = 'activ'.
  4. Click 'Șterge filtrele' to clear the search.
    - expect: The search is cleared and the full Registratură department list is restored.

### 4. Cross-Module Isolation - Flux Digital Department Does Not Appear in Other Modules

**Seed:** `tests/seed.spec.ts`

#### 4.1. Flux Digital department is absent from Dosar Digital sub-module list

**File:** `tests/create-department/cross-module-flux-not-in-dosar.spec.ts`

**Steps:**
  1. Prerequisite: 'Dept_FluxDigital_Test_001' has been created in the Flux Digital sub-module. Navigate to /compartmentsdoc (Dosar digital).
    - expect: The Dosar digital department list is displayed.
  2. Type 'Dept_FluxDigital_Test_001' into the 'Caută' (Search) field.
    - expect: The list filters. The count label should show 'Compartimente (0)' or the table displays a 'no results' message. The department 'Dept_FluxDigital_Test_001' does NOT appear in the list.
  3. Clear the search field using 'Șterge filtrele' and visually scroll through the Dosar digital list to confirm 'Dept_FluxDigital_Test_001' is not present on any page.
    - expect: No entry for 'Dept_FluxDigital_Test_001' is found in the Dosar digital department list across all pages.

#### 4.2. Flux Digital department is absent from Registratură sub-module list

**File:** `tests/create-department/cross-module-flux-not-in-registratura.spec.ts`

**Steps:**
  1. Prerequisite: 'Dept_FluxDigital_Test_001' has been created in the Flux Digital sub-module. Navigate to /compartmentsone (Registratură).
    - expect: The Registratură department list is displayed.
  2. Type 'Dept_FluxDigital_Test_001' into the 'Caută' (Search) field.
    - expect: The list filters. The count label should show 'Compartimente (0)' or a 'no results' message. The department 'Dept_FluxDigital_Test_001' does NOT appear in the Registratură list.
  3. Clear the search and confirm no entry for 'Dept_FluxDigital_Test_001' exists across all pages of the Registratură list.
    - expect: The Registratură module contains no entry for 'Dept_FluxDigital_Test_001'.

#### 4.3. Dosar Digital department is absent from Flux Digital sub-module list

**File:** `tests/create-department/cross-module-dosar-not-in-flux.spec.ts`

**Steps:**
  1. Prerequisite: 'Dept_DosarDigital_Test_001' has been created in the Dosar Digital sub-module. Navigate to /compartmentsreg (Flux digital).
    - expect: The Flux digital department list is displayed.
  2. Type 'Dept_DosarDigital_Test_001' into the 'Caută' (Search) field.
    - expect: The count label shows 'Compartimente (0)' or a 'no results' message. 'Dept_DosarDigital_Test_001' does NOT appear in the Flux digital list.
  3. Clear the search and confirm no entry for 'Dept_DosarDigital_Test_001' is present across all pages of the Flux digital list.
    - expect: The Flux digital module contains no entry for 'Dept_DosarDigital_Test_001'.

#### 4.4. Dosar Digital department is absent from Registratură sub-module list

**File:** `tests/create-department/cross-module-dosar-not-in-registratura.spec.ts`

**Steps:**
  1. Prerequisite: 'Dept_DosarDigital_Test_001' has been created in the Dosar Digital sub-module. Navigate to /compartmentsone (Registratură).
    - expect: The Registratură department list is displayed.
  2. Type 'Dept_DosarDigital_Test_001' into the 'Caută' (Search) field.
    - expect: The count label shows 'Compartimente (0)' or a 'no results' message. 'Dept_DosarDigital_Test_001' does NOT appear in the Registratură list.
  3. Clear the search and confirm no entry for 'Dept_DosarDigital_Test_001' exists on any page of the Registratură list.
    - expect: The Registratură module contains no entry for 'Dept_DosarDigital_Test_001'.

#### 4.5. Registratură department is absent from Flux Digital sub-module list

**File:** `tests/create-department/cross-module-registratura-not-in-flux.spec.ts`

**Steps:**
  1. Prerequisite: 'Dept_Registratura_Test_001' has been created in the Registratură sub-module. Navigate to /compartmentsreg (Flux digital).
    - expect: The Flux digital department list is displayed.
  2. Type 'Dept_Registratura_Test_001' into the 'Caută' (Search) field.
    - expect: The count label shows 'Compartimente (0)' or a 'no results' message. 'Dept_Registratura_Test_001' does NOT appear in the Flux digital list.
  3. Clear the search and confirm no entry for 'Dept_Registratura_Test_001' is present across all pages of the Flux digital list.
    - expect: The Flux digital module contains no entry for 'Dept_Registratura_Test_001'.

#### 4.6. Registratură department is absent from Dosar Digital sub-module list

**File:** `tests/create-department/cross-module-registratura-not-in-dosar.spec.ts`

**Steps:**
  1. Prerequisite: 'Dept_Registratura_Test_001' has been created in the Registratură sub-module. Navigate to /compartmentsdoc (Dosar digital).
    - expect: The Dosar digital department list is displayed.
  2. Type 'Dept_Registratura_Test_001' into the 'Caută' (Search) field.
    - expect: The count label shows 'Compartimente (0)' or a 'no results' message. 'Dept_Registratura_Test_001' does NOT appear in the Dosar digital list.
  3. Clear the search and confirm no entry for 'Dept_Registratura_Test_001' exists on any page of the Dosar digital list.
    - expect: The Dosar digital module contains no entry for 'Dept_Registratura_Test_001'.

### 5. Search Department Feature - Functional Tests

**Seed:** `tests/seed.spec.ts`

#### 5.1. Search for a non-existent department name returns empty results

**File:** `tests/create-department/search-nonexistent.spec.ts`

**Steps:**
  1. Navigate to /compartmentsreg (Flux digital department list).
    - expect: The Flux digital department list is displayed with the full department count.
  2. Type 'NONEXISTENT_DEPT_XYZ_12345' into the 'Caută' (Search) field.
    - expect: The list filters in real time. The count label updates to 'Compartimente (0)'. The table shows an empty state or a 'Nu sunt rezultate' (No results) message. No department rows are displayed.
  3. Clear the search by clicking 'Șterge filtrele'.
    - expect: The full department list is restored and the count returns to its original value.

#### 5.2. Search for a department by partial name matches correctly

**File:** `tests/create-department/search-partial-name.spec.ts`

**Steps:**
  1. Prerequisite: At least one department with a name containing 'FluxDigital' exists in the Flux digital sub-module. Navigate to /compartmentsreg.
    - expect: The Flux digital department list is loaded.
  2. Type 'FluxDigital' (partial name) into the 'Caută' search field.
    - expect: The list filters in real time. Only departments whose names contain 'FluxDigital' are shown. The count label reflects the number of matches.
  3. Verify each displayed row contains 'FluxDigital' in the department name.
    - expect: All displayed rows have department names that include the partial search string 'FluxDigital'.
  4. Clear the search by clicking 'Șterge filtrele'.
    - expect: The full list is restored.

#### 5.3. Search is scoped to the active sub-module and does not search across modules

**File:** `tests/create-department/search-scope-isolation.spec.ts`

**Steps:**
  1. Prerequisite: 'Dept_FluxDigital_Test_001' exists in Flux digital only. Navigate to /compartmentsdoc (Dosar digital).
    - expect: The Dosar digital department list is loaded.
  2. Type 'Dept_FluxDigital_Test_001' into the 'Caută' search field.
    - expect: The search targets only the Dosar digital module. The count shows 'Compartimente (0)' and no matching department is displayed, confirming search does not cross module boundaries.
  3. Switch to the Flux digital tab by clicking the 'Flux digital' link and type 'Dept_FluxDigital_Test_001' into the 'Caută' search field.
    - expect: The count shows 'Compartimente (1)' and 'Dept_FluxDigital_Test_001' appears in the list, confirming the department exists only in Flux digital.

### 6. Negative and Edge Cases - Create Department

**Seed:** `tests/seed.spec.ts`

#### 6.1. Cannot create a department with a duplicate name in the same sub-module

**File:** `tests/create-department/duplicate-name-same-module.spec.ts`

**Steps:**
  1. Prerequisite: 'Dept_FluxDigital_Test_001' already exists in the Flux digital sub-module. Navigate to /compartmentsreg/addcompartment.
    - expect: The Add Department form is displayed with the 'Flux digital' context label.
  2. Enter the already-existing name 'Dept_FluxDigital_Test_001' in the 'Nume compartiment' field.
    - expect: The name is entered in the field.
  3. Select 'Direcție (nivel 1)' from the 'Tip compartiment' dropdown.
    - expect: The type is selected.
  4. Enter a description in the 'Descriere compartiment' field and click 'Salvează'.
    - expect: The application displays an error or validation message indicating the department name already exists in this module. The department is NOT created again. The form remains open or redirects back with an error notification.


#### 6.2. Cancel department creation using the Renunță button returns to the list without creating a department

**File:** `tests/create-department/cancel-creation.spec.ts`

**Steps:**
  1. Navigate to /compartmentsreg/addcompartment (Flux digital Add Department form).
    - expect: The Add Department form is open.
  2. Enter the name 'Dept_ToCancel_Test' in the 'Nume compartiment' field, select a type, and enter a description.
    - expect: The form fields are filled in.
  3. Click the 'Renunță' (Cancel) button.
    - expect: The form is dismissed without saving. The application navigates back to the Flux digital department list at /compartmentsreg.
  4. Search for 'Dept_ToCancel_Test' in the 'Caută' search field.
    - expect: The search returns 'Compartimente (0)' or an empty result. No department named 'Dept_ToCancel_Test' exists in the list, confirming no data was persisted.

#### 6.3. Same department name can exist in different sub-modules independently

**File:** `tests/create-department/same-name-different-modules.spec.ts`

**Steps:**
  1. Navigate to /compartmentsreg/addcompartment and create a department named 'Dept_SharedName_Test' with type 'Direcție (nivel 1)' and any description. Click 'Salvează'.
    - expect: The department 'Dept_SharedName_Test' is created successfully in Flux digital. The user is redirected to /compartmentsreg.
  2. Navigate to /compartmentsdoc/addcompartment and create a department named 'Dept_SharedName_Test' with type 'Direcție (nivel 1)' and any description. Click 'Salvează'.
    - expect: The department 'Dept_SharedName_Test' is created successfully in Dosar digital without a duplicate-name error. The user is redirected to /compartmentsdoc.
  3. Navigate to /compartmentsone/addcompartment and create a department named 'Dept_SharedName_Test' with type 'Direcție (nivel 1)' and any description. Click 'Salvează'.
    - expect: The department 'Dept_SharedName_Test' is created successfully in Registratură without a duplicate-name error. The user is redirected to /compartmentsone.
  4. Search for 'Dept_SharedName_Test' in each of the three sub-modules (/compartmentsreg, /compartmentsdoc, /compartmentsone) using the 'Caută' search field.
    - expect: Each sub-module search returns 'Compartimente (1)' and shows one entry for 'Dept_SharedName_Test'. The same name coexists independently in all three modules without conflict.

#### 6.4. Create a department with the optional 'Inclus în' (parent department) field populated

**File:** `tests/create-department/create-with-parent-department.spec.ts`

**Steps:**
  1. Prerequisite: At least one 'Direcție (nivel 1)' type department exists in the Flux digital sub-module to serve as a parent. Navigate to /compartmentsreg/addcompartment.
    - expect: The Add Department form is displayed.
  2. Enter a unique name (e.g., 'Dept_WithParent_Test_001') in 'Nume compartiment'.
    - expect: The name is entered.
  3. Select 'Serviciu (nivel 2)' from the 'Tip compartiment' dropdown.
    - expect: 'Serviciu (nivel 2)' is selected as the type.
  4. Click the 'Inclus în ...' dropdown and select an existing parent department (a Direcție department).
    - expect: The selected parent department name is displayed in the 'Inclus în' field.
  5. Enter a description and click 'Salvează'.
    - expect: The form submits successfully. The user is redirected to /compartmentsreg. The newly created department appears in the list with the 'Inclus în' column showing the selected parent department name.

#### 6.5. Breadcrumb navigation on the Add Department form works correctly

**File:** `tests/create-department/breadcrumb-navigation.spec.ts`

**Steps:**
  1. Navigate to /compartmentsreg/addcompartment.
    - expect: The Add Department form is open. The breadcrumb shows: Home > Compartimente > Adaugă Compartiment.
  2. Click the 'Compartimente' link in the breadcrumb.
    - expect: The user is navigated back to /compartmentsreg (Flux digital department list) without saving any data.
  3. Navigate to /compartmentsdoc/addcompartment and click the 'Compartimente' link in the breadcrumb.
    - expect: The user is navigated back to /compartmentsdoc (Dosar digital department list).
  4. Navigate to /compartmentsone/addcompartment and click the 'Compartimente' link in the breadcrumb.
    - expect: The user is navigated back to /compartmentsone (Registratură department list).
