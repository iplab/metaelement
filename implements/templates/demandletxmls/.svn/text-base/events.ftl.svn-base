<xml>
<#if (event?exists)>
	<#list event.row as events> 
		<row> 
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
			<#if (events.secondary_artist?exists)>
	        	<secondary_artist>${events.secondary_artist}</secondary_artist> 
			</#if>
			<#if (events.price_range?exists)>
	        	<price_range>${events.price_range}</price_range> 
		  	</#if>
		  	<#if (events.presale_date?exists)>
	        	<presale_date>${events.presale_date}</presale_date> 
	        </#if>
	        <#if (events.onsale_date?exists)>
				<onsale_date>${events.onsale_date}</onsale_date> 
			</#if>
			<#if (events.sponsor_id?exists)>
				<sponsor_id>${events.sponsor_id}</sponsor_id> 
			</#if>
			<#if (events.calendar_start_date?exists)>
				<calendar_start_date>${events.calendar_start_date}</calendar_start_date> 
			</#if>
			<#if (events.calendar_end_date?exists)>
	        	<calendar_end_date>${events.calendar_end_date}</calendar_end_date> 
			</#if>
			<#if (events.large_image_url?exists)>
				<large_image_url>${events.large_image_url}</large_image_url> 
			</#if>
			<#if (events.large_image_enabled?exists)>
				<large_image_enabled>${events.large_image_enabled}</large_image_enabled>
			</#if>
			<#if (events.small_image_url?exists)>
				<small_image_url>${events.small_image_url}</small_image_url>
			</#if>
			<#if (events.video_clip_url?exists)>
				<video_clip_url>${events.video_clip_url}</video_clip_url> 
			</#if>
			<#if (events.video_clip_enabled?exists)>
				<video_clip_enabled>${events.video_clip_enabled}</video_clip_enabled>
			</#if>
			<#if (events.embedded_object_url?exists)>
				<embedded_object_url>${events.embedded_object_url}</embedded_object_url>
			</#if>
			<#if (events.embedded_object_enabled?exists)>
				<embedded_object_enabled>${events.embedded_object_enabled}</embedded_object_enabled>
			</#if>
			<#if (events.page_name?exists)>
			    <page_name>${events.page_name}</page_name> 
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
					<#if (performance.group_sales?exists)>
						<group_sales>${performance.group_sales}</group_sales>
					</#if>
					<#if (performance.peak_sales?exists)>
						<peak_sales>${performance.peak_sales}</peak_sales>
					</#if>
					<#if (performance.price?exists)>
						<price>${performance.price}</price>
					</#if>
					</performance>
				</#list>
			</#if>
		</row>
	</#list> 
</#if>
</xml>