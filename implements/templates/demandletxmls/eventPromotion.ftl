<xml>
<#if (event?exists)>
	<#list event.row as events> 
		<row> 
			<#if (events.name?exists)>
	    		<name><![CDATA[${events.name}]]></name> 
	    	</#if>
	    	<#if (events.event_name?exists)>
	    		<event_name><![CDATA[${events.event_name}]]></event_name> 
	    	</#if>
	    	<#if (events.location?exists)>
		        <location><![CDATA[${events.location}]]></location> 
	        </#if>
	        <#if (events.large_image?exists)>
				<large_image_url><![CDATA[${events.large_image}]]></large_image_url> 
			</#if>
	    	<#if (events.start_date?exists)>
				<start_date><![CDATA[${events.start_date}]]></start_date> 
			</#if>
			<#if (events.end_date?exists)>
	        	<end_date><![CDATA[${events.end_date}]]></end_date> 
			</#if>
			<#if (events.promo_code?exists)>
				<promo_code><![CDATA[${events.promo_code}]]></promo_code>
			</#if>
			<#if (events.description?exists)>
			    <description><![CDATA[${events.description}]]></description> 
			</#if>
			<#if (events.performance?exists)>
				<#list events.performance as performance>
					<performance>
					<#if (performance.event_date?exists)>
						<event_date><![CDATA[${performance.event_date}]]></event_date>
					</#if>
					<#if (performance.ticket_master_url?exists)>
						<ticket_master_url><![CDATA[${performance.ticket_master_url}]]></ticket_master_url>
					</#if>
					<#if (performance.sold_out?exists)>
						<sold_out><![CDATA[${performance.sold_out}]]></sold_out>
					</#if>					
					<#if (performance.price?exists)>
						<price><![CDATA[${performance.price}]]></price>
					</#if>
					</performance>
				</#list>
			</#if>
		</row>
	</#list> 
</#if>
</xml>