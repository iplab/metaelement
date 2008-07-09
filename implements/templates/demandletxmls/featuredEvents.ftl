<xml>
<#if (event?exists)>
	<#list event.row as events>
		<event>
			<#if (events.large_image_url?exists)>
				<image>${events.large_image_url}</image>
			</#if>
			<#if (events.tour_name?exists)>
				<#if (events.secondary_artist?exists)>
					<information>${events.tour_name} ${events.secondary_artist}</information>
				</#if>
			</#if>
			<#if (events.name?exists)>
				<artist>${events.name}</artist>
			</#if>
			<#if (events.location?exists)>
				<location>${events.location}</location>
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
							<link>${performance.ticket_master_url}</link>
						</#if>
					</performance>
				</#list>
			</#if>
		</event>
	</#list>
</#if>
</xml>