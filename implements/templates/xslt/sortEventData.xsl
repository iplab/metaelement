<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<!--<xsl:output cdata-section-elements="image information artist location page_name event_date link"/>-->
	<!-- used to sort the XML Event Data before it gets saved to file -->
	<xsl:template match="xml">
		<xsl:copy>
			<xsl:apply-templates>
				<!--<xsl:sort select="performance/event_date"/>-->
				   <xsl:sort select="substring(performance/event_date,7,4)"/> <!-- year  -->
				   <xsl:sort select="substring(performance/event_date,1,2)"/> <!-- month -->
				   <xsl:sort select="substring(performance/event_date,4,2)"/> <!-- day   -->
				   <xsl:sort select="name" />
		     </xsl:apply-templates>
		</xsl:copy>
	</xsl:template>
	
	<xsl:template match="*">
    	<xsl:copy>
		      <xsl:apply-templates/>
	    </xsl:copy>
	  </xsl:template>

</xsl:stylesheet>