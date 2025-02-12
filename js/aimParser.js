const fs = require('fs');
/*

function loadExistingRecords(variableString, recordDataName) {

  const lines = variableString.split('\n').map(line => line.trim()).filter(line => line);

  const result = [];

  let variableName = '';
  let insideBlock = false;

  lines.forEach(line => {

	const matchVariable = line.match(/(.+?)\s+as\s+["']?(.+)["']?/i);
	if (matchVariable) {
	  variableName = matchVariable[1].trim();
	}


	if (line.startsWith('(')) {

	  insideBlock = true;
	  return; //skipping processing cuz bracket
	}

	if (line.startsWith(')')) {
	  insideBlock = false;
	  return;
	}

	if (insideBlock) {
	  if(line.startsWith('enable')) {
		return;
	  }

	  result.pop();
	  result.push(`row1.${variableName}.address_line_1=${recordDataName}.getJSON("${variableName}_address_line_1");`);
	  result.push(`row1.${variableName}.address_line_2=${recordDataName}.getJSON("${variableName}_address_line_2");`);
	  result.push(`row1.${variableName}.district_city=${recordDataName}.getJSON("${variableName}_district_city");`);
	  result.push(`row1.${variableName}.state_province=${recordDataName}.getJSON("${variableName}_state_province");`);
	  result.push(`row1.${variableName}.country=${recordDataName}.getJSON("${variableName}_country");`);
	  result.push(`row1.${variableName}.postal_Code=${recordDataName}.getJSON("${variableName}_postal_Code");`);

	  return;
	}

	if (!insideBlock) {
	  const subsequentMatch = line.match(/(.+?)\s+as\s+["']?(.+)["']?/i);
	  if (subsequentMatch) {
		variableName = subsequentMatch[1].trim(); // Extract variable name from subsequent lines
		result.push(`row1.${variableName}=buildersRiskRecordData.getJSON("${variableName}");`);
	  }
	}
  })

  return result.join('\n');
}

const variableString = `
	  Builders_Risk as "Builder's Risk"
		Wrap_Up_Liability as "Wrap-Up Liability"
		SITE_PLAN_indicating_distance_construction_and_occupancy_of_adjacent_exposures as "SITE PLAN indicating distance, construction and occupancy of adjacent exposures"
		ARCHITECTURAL_PLANS as "ARCHITECTURAL PLANS"
		CONSTRUCTION_SCHEDULE_or_GANTT_CHART as "CONSTRUCTION SCHEDULE or GANTT CHART"
		GEOTECHNICAL_REPORT_including_RECOMMENDATIONS as "GEOTECHNICAL REPORT including RECOMMENDATIONS"
		STRUCTURAL_ENGINEERING_REPORT_incl_RECOMMENDATIONS as "STRUCTURAL ENGINEERING REPORT incl. RECOMMENDATIONS"
		tick_if_no_GEOTECH_REPORT_was_completed as "tick if no GEOTECH REPORT was completed "
		tick_if_no_STRUCTURAL_REPORT_was_completed as "tick if no STRUCTURAL REPORT was completed"
		Mailing_Address_Of_Applicant  as "Mailing Address of Applicant"
		  (
				displayformat = [address_line_1+""+address_line_2+""+district_city+""+state_province+""+postal_Code+""+country]
				enable = Link_to_Map,Show_As_Text
		  )
		Description_Of_Project as "Description of Project"
		Address_Location_Of_Project1  as "Address/Location of Project"
		  (
				displayformat = [address_line_1+""+address_line_2+""+district_city+""+state_province+""+postal_Code+""+country]
				enable = Link_to_Map,Show_As_Text
		  )
		Indicate_If_Units_Are_Built_On_Speculation_Prior_To_Being_Sold as "For habitational projects, please indicate if units are built on speculation (prior to being sold)"
		If_Yes_Then_Quantity as "If Yes, then Quantity"
		Project_To_Be_Insured_Based_On_Ccdc_Contract as "Is project to be insured based on CCDC contract?"
		Construction_Period_From as "Construction Period From"
		Height_Of_Structure_Below_Grade as "Height of structure (below grade)"
		Construction_Period_To as "Construction Period To"
		Height_Of_Structure_Above_Grade as "Height of structure (above grade)"
		Policy_Term_From as "Policy Term From"
		Total_Area as "Total area"
		Policy_Term_To as "Policy Term To"
		For_Mega_Warehouses_Stadiums_Hockey_Rinks_Bridges_And_Any_Other_Long_Span_Structure_Indicate as "For mega-warehouses, stadiums, hockey rinks, bridges and any other long-span structure, indicate the maximum  unsupported span length:"
		Are_Backfill_Aggregates_Tested_For_The_Presence_Of_Pyrite_Or_Sulfide_Compounds as "Are backfill aggregates tested for the presence of pyrite or sulfide compounds?"
		Is_The_Concrete_Test_If_For_The_Presence_Of_Pyrite_Or_Sulfide_Compounds as "Is the concrete tested for the presence of pyrite or sulfide compounds?"
		Roof_Structure as "Roof Structure: "
		Exterior_Walls as "Exterior Walls:"
		Framework as "Framework:"
		Floors_Covering as "Floors Covering: "
		Floors_Structure as "Floors Structure: "
		Roof_Covering as "Roof Covering:"
		Is_Entire_Site_Fenced as "Is Entire Site Fenced?"
		If_Yes_Describe_Height as "If Yes ,  describe Height:"
		If_Yes_describe_Type as "If Yes , describe Type:"
		Watchman_Service as "Watchman Service?"
		If_Yes_How_Many_Hours as "If Yes , how many hours?"
		If_Yes_How_Many_Rounds as "If Yes , how many rounds?"
		Alarm as "Alarm?"
		Alarm_Sounds_To as "Alarm sounds to: "
		Video_Surveillance as "Video Surveillance?"
		Describe_Water_Damage_Loss_Prevention_Procedures as "Describe water damage loss prevention procedures:"
		Is_A_Fire_Prevention_Manager as "Is a fire prevention program manager at the project site?  (as per NFPA 241 7.2.1.2. and 7.2.4.3.) "
		Are_Hot_Works_Permits_required_and_enforced as "Are Hot Works Permits required and enforced?"
		Will_Construction_Operations_Be_Performed_In_Compliance_Of_The_Geotechnical_Report_S as "Will construction operations be performed in compliance of the Geotechnical Report’s recommendations?"
		Provide_Details as "Provide Details for modifications:"
		If_Copy_Of_Geotechnical_Report_And_Recommendations_Is_Not_Available_Please_Advise_The_Soil_Condition as "If copy of Geotechnical Report and recommendations is not available, please advise the soil conditions which foundation will be constructed upon (after overburden is removed)"
		Describe_Soil_And_Groundwater_Conditions as "Describe soil and groundwater conditions: "
		If_So_Detail_The_Rules_And_Who_Is_Responsible_For_Oversight as "If so, detail the rules and who is responsible for oversight:"
		Details_Including_Plan_Of_Location_Of_Cameras as "Details including plan of location of cameras: "
		Unusual_Experimental_Or_State_Of_The_Art_Features_In_The_Construction_Design as "Describe any unusual, experimental or state-of-the-art features in the construction design"
		Adjacent_Structures_Attach_site_plan_if_available.Adjacent_Structures_Attach_site_plan_if_available as "Adjacent Structures (Attach site plan if available)"
		Blasting as "Blasting:"
		Shoring as "Shoring:"
		Pile_Driving as "Pile Driving:"
		Underpinning as "Underpinning:"
		Demolition as "Demolition:"
		Describe_Any_Occupancy_Before_Completion_Of_The_Project_When_And_Nature_Of_Occupancy as "Describe any occupancy before completion of the project (when and nature of occupancy):"
		Is_This_A_Fast_Track_Project as "Is this a fast track project?"
		If_So_Detail_Experience_With_Similar_Projects as "If so, detail experience with similar projects:"
		Does_The_Project_Manager_General_Contractor_Have_Experience_With_A_Project_Similar_In_Scope as "Does the Project Manager/General Contractor have experience with a project similar in scope?"
		List_Project_Manager_s_General_Contractor_s_five_5_largest_projects_in_the_past_five_5_years.Name as "List Project Manager’s/General Contractor’s five (5) largest projects in the past five (5) years:"
		Total_Estimated_Project_Value as "Total Estimated Project Value:"
		Hard_Costs_Labour_materials_professional_fees_to_enter_into_and_form_part_of_the_project as "Hard Costs: "
		Add_10_if_CCDC_Project_as_per_Question_7_in_General_Information_Section as "Add 10% if CCDC project :"
		Total_Other_Property_To_Be_Insured as "Total Other Property to be insured:"
		Contractors_Equipment_Value as "Contractors Equipment: Value $ :"
		Other_Property_To_Be_Insured as "Other Property to be insured : Value $:"
		Temporary_Structures as "Temporary structures: Value $:"
		Contractors_Equipment_Description as "Contractors Equipment: Description:"
		Temporary_structures_e_g_scaffolding_forms_hoarding_Description as "Temporary structures : Description:"
		Other_Property_to_be_insured_e_g_site_office_and_contents_fence_sign_etc_Description as "Other Property to be insured :  Description:"
		If_Coverage_Is_Required_To_Existing_Structure_Detail_Age_Construction_Condition_And_Occupancy as "If coverage is required to Existing Structure, detail age, construction, condition and occupancy of such property:"
		Nature_of_the_renovations_alterations_or_repairs_to_Existing_Structure as "Nature of the renovations, alterations or repairs to Existing Structure:"
		Is_Existing_Structure_designated_as_a_historical_building as "Is Existing Structure designated as a historical building?"
		Is_Existing_Structure_protected_as_a_heritage_building as "Is Existing Structure protected as a heritage building?"
		Current_value_of_Existing_Structure_Value as "Current value of Existing Structure: Value $"
		Current_value_of_Existing_Structure_Method_of_valuation as "Current value of Existing Structure: Method of valuation: $"
		Demolition_expense_to_remove_unwanted_materials_Cost as "Demolition expense to remove unwanted materials : Cost $ :"
		Value_after_unwanted_materials_have_been_removed_but_before_any_new_materials_have_been_installed as " Value after unwanted materials have been removed but before any new materials have been installed: Value $"
		Value_of_any_materials_salvaged_from_the_structure_that_will_not_be_re_used_in_the_structure_Descr as "Value of any materials salvaged from the structure that will not be re-used in the structure: Description of materials: "
		Value_after_unwanted_materials_have_been_removed_but_before_any_new_materials_have_been_installed1 as " Value after unwanted materials have been removed but before any new materials have been installed: Method of Valuation:Value $"
		Value_of_any_materials_salvaged_from_the_structure_that_will_not_be_re_used_in_the_structure_Value as "Value of any materials salvaged from the structure that will not be re-used in the structure: Value $:"
		Value_of_any_materials_salvaged_from_the_structure_that_will_not_be_re_used_in_the_structure_Metho as "Value of any materials salvaged from the structure that will not be re-used in the structure: Method of valuation:"
		Is_SOFT_COSTS_coverage_required as "Is SOFT COSTS coverage required?"
		If_YES_the_Total_Limit_is_the_sum_of_additional_interest_financials_costs_permits_leasing_marketin as "If YES, the Total Limit is the sum of additional interest, financials costs, permits, leasing &  marketing expenses, legal & accounting expense, and other carrying costs. "
		Is_EXTRA_EXPENSE_coverage_required as "Is EXTRA EXPENSE coverage required?"
		If_field as "If YES, for how many month(s) indemnity period"
		Currency
		Is_BUSINESS_INTERRUPTION_coverage_DELAYED_OPENING_required as "Is BUSINESS INTERRUPTION coverage (DELAYED OPENING) required?"
		If_YES_type_of_income as "If YES, type of income:"
		Loss_of_Rents_or as "Loss of Rents or Loss of Earnings in currency"
		Loss_of_Earnings as "Total Limit being $ per month"
		For_how_many_month_s__indemnity_period as "For how many month(s) indemnity period "
		COVERAGE_REQUIREMENTS.Details_of_Limits as "COVERAGE REQUIREMENTS:"
		List_offsite_locations_and_maximum_value_at_each.LOCATION as "List offsite locations and maximum value at each:"
		Transit as "Transit:  "
		Who_will_perform_testing_operations as "Who will perform testing operations?"
		Describe_operations_involved_in_testing_and_commissioning as "Describe operations involved in testing and commissioning:"
		When_will_testing_occur_Dates as "From When will testing occur?( Dates ) :"
		Will_project_involve_installation_of_any_used_equipment as "Will project involve installation of any used equipment?"
		To_When_will_testing_occur_Dates as "To When will testing occur?( Dates ) :"
		Distance_to_nearest_Fire_Department as "Distance to nearest Fire Department:"
		Name_of_City_or_Town_providing_protection as "Name of City or Town providing protection:"
		Hydrants_operational_Number_within_508_feet_155_metres_of_all_areas_of_the_structure as "Hydrants (operational):"
		Describe_private_fire_protection_and_the_distribution_of_portable_fire_extinguishers_at_the_projec as "Describe private fire protection and the distribution of portable fire extinguishers at the project site:"
		Will_the_project_be_sprinklered as "Will the project be sprinklered?"
		If_so_at_which_time_will_be_sprinkler_system_be_in_operation as "If so, at which time will be sprinkler system be in operation?"
		If_yes_check_which_is_applicable as "If yes, check which is applicable"
		Describe_who_performs_the_testing as "Describe who performs the testing:"
		Type_of_foundation_for_each_structure as "Type of foundation for each structure"
		Is_the_concrete_tested_for_quality_and_ultimate_strength as "Is the concrete tested for quality and ultimate strength?"
		Are_insulated_concrete_forms_ICF_to_be_used as "Are insulated concrete forms (ICF) to be used?"
		Describe_any_special_features_such_as_stained_glass_glass_curtain_walls_and_artwork_to_be_incorpor as "Describe any special features such as stained glass, glass curtain walls, and artwork to be incorporated or included:"
		LEED_Building_Design_and_Construction_rating_level_the_building_is_intended_to_comply_with as "LEED Building Design and Construction rating level the building is intended to comply with:"
		of_roof_covered_with_Green_Roof as "% of roof covered with Green Roof:"
		Describe_installation as "Describe installation:"
		Power_Generation_capabilities_incorporated_as_part_of_the_project as "Power Generation capabilities incorporated as part of the project"
		Describe_any_additional_information_that_will_assist_with_underwriting as "Describe any additional information that will assist with underwriting:"
		Winter_heating_conditions_type_of_heaters as "Winter heating conditions (type of heaters):"
		Is_debris_removed_from_in_and_around_the_buildings_at_the_end_of_each_day as "Is debris removed from in and around the buildings at the end of each day?"
		Is_debris_burned_at_the_construction_site as "Is debris burned at the construction site?"
		Are_waste_bins_ever_situated_against_or_close_to_building_walls as "Are waste bins ever situated against or close to building walls?"
		Frequency_of_waste_bins_emptying as "Frequency of waste bins emptying:"
		Explosion as "Explosion:"
		Past_flood_history_at_site as "Past flood history at site:"
		Describe_exposure_from_surface_water_during_and_after_excavation as "Describe exposure from surface water during and after excavation."
		Describe_precautions_to_be_taken_to_prevent_damage_from_flood_d_What as "Describe precautions to be taken to prevent damage from flood: "
		What_is_being_done_to_prevent_run_off_damage as "What is being done to prevent run-off damage?"
		Type_of_dewatering as "Type of dewatering:"
		Percentage_of_exterior_walls_covered_with_metal_or_aluminum_composite_cladding_panels_e_g_MCM_ACM as "Percentage of exterior walls covered with metal or aluminum composite cladding panels containing combustible materials that are not NFPA 285 approved or FM stamped"
		Percentage_of_exterior_walls_covered_with_metal_or_aluminum_composite_cladding_panels_containing_c as "Percentage of exterior walls covered with metal or aluminum composite cladding panels containing combustible materials that are not NFPA 285 approved or FM stamped"
		Describe_the_manufacturer_and_system_being_used as "Describe the manufacturer and system being used:"
		Percentage_of_exterior_walls_covered_with_Exterior_Insulation_Finishing_System_EIFS_containing_com as "Percentage of exterior walls covered with Exterior Insulation Finishing System (EIFS) containing combustible materials :"
		Percentage_of_exterior_walls_covered_with_Exterior_Insulation_Finishing_System_EIFS_containing_com1 as "Percentage of exterior walls covered with Exterior Insulation Finishing System (EIFS) containing combustible materials :"
		Describe_the_EIFS_system_being_used as "Describe the EIFS system being used:"
		Describe_installation1 as "Describe installation:"
		Are_redundant_pumps_available as "Are redundant pumps available?"
		Is_a_backup_power_supply_available as "Is a backup power supply available?"
		Contracted_completion_date as "Contracted completion date:"
		Anticipated_completion_date as "Anticipated completion date:"
		Anticipated_replacement_times_for_key_items_if_reorder_necessitated.ITEM as "Anticipated replacement times for key items if reorder necessitated "
		Provide_details_of_RISK_MANAGEMENT_and_QUALITY_CONTROL_PROTOCOLS_to_be_implemented_to_protect_insu as "Provide details of RISK MANAGEMENT and QUALITY CONTROL PROTOCOLS to be implemented to protect insuredproperty and ensure the quality of the project:"
		Claims_Experience_Attach_a_separate_sheet_if_more_space_required.Date_field as "Claims Experience (Attach a separate sheet if more space required):"
		SUBCONTRACTOR_DETAILS1.Subcontractor_s_Name_of_Specified_Operation as "SUBCONTRACTOR DETAILS:"
		Name_Of_Applicant as "Name of Applicant"
		Name_of_the_Project1 as "Name of the Project"
		Project_Owner as "Project Owner"
		General_Contractor as "General Contractor"
		Prime_Architectural_Engineering_Consultant as "Prime Architectural/Engineering Consultant"
`;

const formattedOutput = loadExistingRecords(variableString, "buildersRiskRecordData");

const outputFilePath = 'output.txt'; // Specify your output file path here

fs.writeFile(outputFilePath, formattedOutput, err => {
	if (err) {
		console.error('Error writing to file:', err);
	} else {
		console.log('File written successfully:', outputFilePath);
	}
});

*/



const obj = {
	"clientid": "ZYLW01",
	"homephone": "(905) 774-3477",
	"streetname": "",
	"prefix": "",
	"cust_since": "",
	"reference": "",
	"secondbusinessphone": "",
	"businessphone": "(905) 774-3477",
	"nickname": "",
	"secondhomephone": "",
	"lived_here_since": "",
	"cellphone": "",
	"ID": "4255713000020061457",
	"Added_Time": "12-Feb-2025 08:16:26",
	"csr_name": "Teresa Culver",
	"branchcode": "DUN",
	"Modified_Time": "12-Feb-2025 10:23:14",
	"website": "",
	"emailaddress": "",
	"customersector": "CLI",
	"lastname": "Gerarda Zylstra",
	"producer_name": "House Account",
	"preferredlanguage": "E",
	"csr_code": "TC",
	"attention": "",
	"recent_xml_file": "SDA2025010821201319.XML",
	"faxnumber": "",
}

function genCode(obj) {
	let codeArr = [];
	for (const [key, value] of Object.entries(obj)) {
		codeArr.push(`dataMap.put("${key}",record.get("${key}"));`)
	}
	return codeArr.join("\n");
}

console.log(genCode(obj));

const outputFilePath = 'output.txt'; // Specify your output file path here

fs.writeFile(outputFilePath, genCode(obj), err => {
	if (err) {
		console.error('Error writing to file:', err);
	} else {
		console.log('File written successfully:', outputFilePath);
	}
});