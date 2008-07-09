<xml>
<#if (event?exists)>
	<#list event.row as events>
		<row>
			<#if (events.name?exists)>
				<name>${events.name}</name>
			</#if>
			<#if (events.page_name?exists)>
				<page_name>${events.page_name}</page_name>
			</#if>
			<#if (events.calendar_start_date?exists)>
				<calendar_start_date>${events.calendar_start_date}</calendar_start_date>
			</#if>
			<#if (events.calendar_end_date?exists)>
				<calendar_end_date>${events.calendar_end_date}</calendar_end_date>
			</#if>
			<#if (events.team_event?exists)>
				<team_event>${events.team_event}</team_event>
			</#if>
		</row>
	</#list>
</#if>
</xml>
