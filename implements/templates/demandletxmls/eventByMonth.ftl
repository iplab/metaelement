<xml> 
<#if (event?exists)>
	<#list event.row as events>
		<row> 
			<#if (events.event_id?exists)>
				<event_id>${events.event_id}</event_id> 
			</#if>
			<#if (events.name?exists)>
		        <name>${events.name}</name> 
	      	</#if>
	        <#if (events.event_type_id?exists)>
	    	    <event_type_id>${events.event_type_id}</event_type_id> 
	        </#if>
	        <#if (events.event_sub_type_id?exists)>
	        	<event_sub_type_id>${events.event_sub_type_id}</event_sub_type_id> 
	        </#if>
	        <#if (events.venue_id?exists)>
	        	<venue_id>${events.venue_id}</venue_id> 
	        </#if>
	        <#if (events.location?exists)>
   	        	<location>${events.location}</location> 
   	        </#if>
   	        <#if (events.tour_name?exists)>
	        	<tour_name>${events.tour_name}</tour_name> 
	        </#if>
	        <#if (events.presale_date?exists)>
	        	<presale_date>${events.presale_date}</presale_date> 
	        </#if>
	        <#if (events.onsale_date?exists)>
				<onsale_date>${events.onsale_date}</onsale_date> 
			</#if>
			<#if (events.calendar_start_date?exists)>
				<calendar_start_date>${events.calendar_start_date}</calendar_start_date>
			</#if>
			<#if (events.calendar_end_date?exists)>
				<calendar_end_date>${events.calendar_end_date}</calendar_end_date>  
			</#if>
			<#if (events.small_image_url?exists)>
				<small_image_url>${events.small_image_url}</small_image_url> 
			</#if>
			<#if (events.page_name?exists)>
		    	<page_name>${events.page_name}</page_name>	
		    </#if>
		    <#if (events.team_event?exists)>
				<team_event>${events.team_event}</team_event>
			</#if>
		    <#if (events.performance?exists)>
			    <#list events.performance as performance>
					<performance>
					<#if (performance.event_date?exists)>
						<event_date>${performance.event_date}</event_date>
					</#if>
					<#if (performance.ticket_master_url?exists)>
						<ticket_master_url>${performance.ticket_master_url}</ticket_master_url>
					</#if>
					<#if (performance.sold_out?exists)>
						<sold_out>${performance.sold_out}</sold_out>
					</#if>
					</performance>
				</#list>
			</#if>
		</row>
	</#list> 
	</#if>
</xml>
