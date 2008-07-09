<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
<xsl:output method="html" cdata-section-elements="actions" />
<xsl:output method="html" cdata-section-elements="event_promo-name" />
<xsl:output method="html" cdata-section-elements="event-name" />
<!-- doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"
     doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"/> -->
	<xsl:param name="Page" select="0" />
	<xsl:param name="PageSize" select="20" />

	<xsl:template match="/xml">
		<xsl:apply-templates select="row">
			<xsl:sort select="property[@name='event.event_name']"/>
		</xsl:apply-templates>
	</xsl:template>
	
	<xsl:template match="row">
		<xsl:if test="position() >= ($Page * $PageSize) + 1">
			<xsl:if test="position() &lt;= $PageSize + ($PageSize * $Page)">
				<row>
					<xsl:apply-templates select="property"/>
				</row>
			</xsl:if>
		</xsl:if>
	</xsl:template>
	
	<xsl:template match="property">
		<!-- following 8 lines does the character replacement -->
		<xsl:variable name="myString" select="@name" />
		<xsl:variable name="raw">
			 <xsl:call-template name="replaceCharsInString">
	  			 <xsl:with-param name="stringIn" select="string($myString)"/>
			     <xsl:with-param name="charsIn" select="'.'"/>
			     <xsl:with-param name="charsOut" select="'-'"/>
		  	</xsl:call-template>
		</xsl:variable>

		<xsl:choose>
			<xsl:when test="position() = 2">
				<event_promo-name>
					<xsl:value-of select="."/>
				</event_promo-name>
			</xsl:when>
			<xsl:when test="position() = 5">
				<event-name>
					<xsl:value-of select="."/>
				</event-name>
			</xsl:when>
			<xsl:otherwise>
				<xsl:element name="{$raw}">
					<xsl:if test=". != 'null'">
						<xsl:value-of select="."/>
					</xsl:if> 
				</xsl:element>
			</xsl:otherwise>
		</xsl:choose>

		<xsl:if test="$raw = 'event_promo-event_promo_id'">
			<actions><![CDATA[<a href="#" onclick="events.promos.loadEditPromo(']]><xsl:value-of select="."/><![CDATA[');"><img src="/manage/extjs/resources/images/default/basic-dialog/collapse.gif" /></a> <a href="#" onclick="events.promos.deletePromo(']]><xsl:value-of select="."/><![CDATA[');"><img src="/manage/extjs/resources/images/default/basic-dialog/close.gif" /></a>]]></actions>
		</xsl:if>
	</xsl:template>

	<!-- here is the template that does the character replacement -->
	<xsl:template name="replaceCharsInString">
	  <xsl:param name="stringIn"/>
	  <xsl:param name="charsIn"/>
	  <xsl:param name="charsOut"/>
	  <xsl:choose>
	    <xsl:when test="contains($stringIn,$charsIn)">
	      <xsl:value-of select="concat(substring-before($stringIn,$charsIn),$charsOut)"/>
	      <xsl:call-template name="replaceCharsInString">
	        <xsl:with-param name="stringIn" select="substring-after($stringIn,$charsIn)"/>
	        <xsl:with-param name="charsIn" select="$charsIn"/>
	        <xsl:with-param name="charsOut" select="$charsOut"/>
	      </xsl:call-template>
	    </xsl:when>
	    <xsl:otherwise>
	      <xsl:value-of select="$stringIn"/>
	    </xsl:otherwise>
	  </xsl:choose>
	</xsl:template>
	
</xsl:stylesheet>
