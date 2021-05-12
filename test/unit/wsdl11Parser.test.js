const expect = require('chai').expect,
  assert = require('chai').assert,
  WsdlObject = require('../../lib/WSDLObject').WsdlObject,
  {
    DOC_HAS_NO_BINDIGS_MESSAGE,
    DOC_HAS_NO_BINDIGS_OPERATIONS_MESSAGE,
    DOC_HAS_NO_SERVICE_PORT_MESSAGE
  } = require('../../lib/constants/messageConstants'),
  {
    POST_METHOD
  } = require('../../lib/utils/httpUtils'),
  {
    Wsdl11Parser,
    WSDL_NS_URL,
    SOAP_PROTOCOL,
    SOAP12_PROTOCOL,
    HTTP_PROTOCOL,
    WSDL_ROOT
  } = require('../../lib/Wsdl11Parser'),
  {
    XMLParser
  } = require('../../lib/XMLParser'),
  {
    PARSER_ATRIBUTE_NAME_PLACE_HOLDER,
    getBindings,
    getServices
  } = require('../../lib/WsdlParserCommon'),
  fs = require('fs'),
  specialCasesWSDLs = 'test/data/specialCases',
  numberConvertionSecurity = 'test/data/auth/usernameToken/NoSecurityBinding.wsdl',
  NUMBERCONVERSION_INPUT = `
  <?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
xmlns:xs="http://www.w3.org/2001/XMLSchema" 
xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
<types>
<xs:schema elementFormDefault="qualified" targetNamespace="http://www.dataaccess.com/webservicesserver/">
  <xs:element name="NumberToWords">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="ubiNum" type="xs:unsignedLong"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
  <xs:element name="NumberToWordsResponse">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="NumberToWordsResult" type="xs:string"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
  <xs:element name="NumberToDollars">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="dNum" type="xs:decimal"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
  <xs:element name="NumberToDollarsResponse">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="NumberToDollarsResult" type="xs:string"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>
</types>
<message name="NumberToWordsSoapRequest">
<part name="parameters" element="tns:NumberToWords"/>
</message>
<message name="NumberToWordsSoapResponse">
<part name="parameters" element="tns:NumberToWordsResponse"/>
</message>
<message name="NumberToDollarsSoapRequest">
<part name="parameters" element="tns:NumberToDollars"/>
</message>
<message name="NumberToDollarsSoapResponse">
<part name="parameters" element="tns:NumberToDollarsResponse"/>
</message>
<portType name="NumberConversionSoapType">
<operation name="NumberToWords">
  <documentation>Returns the word corresponding 
  to the positive number passed as parameter. Limited to quadrillions.</documentation>
  <input message="tns:NumberToWordsSoapRequest"/>
  <output message="tns:NumberToWordsSoapResponse"/>
</operation>
<operation name="NumberToDollars">
  <documentation>Returns the non-zero dollar amount of the passed number.</documentation>
  <input message="tns:NumberToDollarsSoapRequest"/>
  <output message="tns:NumberToDollarsSoapResponse"/>
</operation>
</portType>
<binding name="NumberConversionSoapBinding" type="tns:NumberConversionSoapType">
<soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
<operation name="NumberToWords">
  <soap:operation soapAction="" style="document"/>
  <input>
    <soap:body use="literal"/>
  </input>
  <output>
    <soap:body use="literal"/>
  </output>
</operation>
<operation name="NumberToDollars">
  <soap:operation soapAction="" style="document"/>
  <input>
    <soap:body use="literal"/>
  </input>
  <output>
    <soap:body use="literal"/>
  </output>
</operation>
</binding>
<binding name="NumberConversionSoapBinding12" type="tns:NumberConversionSoapType">
<soap12:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
<operation name="NumberToWords">
  <soap12:operation soapAction="" style="document"/>
  <input>
    <soap12:body use="literal"/>
  </input>
  <output>
    <soap12:body use="literal"/>
  </output>
</operation>
<operation name="NumberToDollars">
  <soap12:operation soapAction="" style="document"/>
  <input>
    <soap12:body use="literal"/>
  </input>
  <output>
    <soap12:body use="literal"/>
  </output>
</operation>
</binding>
<service name="NumberConversion">
<documentation>The Number Conversion Web Service, implemented with Visual DataFlex, 
provides functions that convert numbers into words or dollar amounts.</documentation>
<port name="NumberConversionSoap" binding="tns:NumberConversionSoapBinding">
  <soap:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
</port>
<port name="NumberConversionSoap12" binding="tns:NumberConversionSoapBinding12">
  <soap12:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
</port>
</service>
</definitions>
`,
  TEMPERATURE_CONVERTER = `<wsdl:definitions xmlns:tm="http://microsoft.com/wsdl/mime/textMatching/" 
  xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" 
  xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/" 
  xmlns:tns="https://www.w3schools.com/xml/" 
  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
  xmlns:s="http://www.w3.org/2001/XMLSchema" 
  xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
  xmlns:http="http://schemas.xmlsoap.org/wsdl/http/" 
  xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="https://www.w3schools.com/xml/">
<wsdl:types>
    <s:schema elementFormDefault="qualified" targetNamespace="https://www.w3schools.com/xml/">
        <s:element name="FahrenheitToCelsius">
            <s:complexType>
                <s:sequence>
                    <s:element minOccurs="0" maxOccurs="1" name="Fahrenheit" type="s:string" />
                </s:sequence>
            </s:complexType>
        </s:element>
        <s:element name="FahrenheitToCelsiusResponse">
            <s:complexType>
                <s:sequence>
                    <s:element minOccurs="0" maxOccurs="1" name="FahrenheitToCelsiusResult" type="s:string" />
                </s:sequence>
            </s:complexType>
        </s:element>
        <s:element name="CelsiusToFahrenheit">
            <s:complexType>
                <s:sequence>
                    <s:element minOccurs="0" maxOccurs="1" name="Celsius" type="s:string" />
                </s:sequence>
            </s:complexType>
        </s:element>
        <s:element name="CelsiusToFahrenheitResponse">
            <s:complexType>
                <s:sequence>
                    <s:element minOccurs="0" maxOccurs="1" name="CelsiusToFahrenheitResult" type="s:string" />
                </s:sequence>
            </s:complexType>
        </s:element>
        <s:element name="string" nillable="true" type="s:string" />
    </s:schema>
</wsdl:types>
<wsdl:message name="FahrenheitToCelsiusSoapIn">
    <wsdl:part name="parameters" element="tns:FahrenheitToCelsius" />
</wsdl:message>
<wsdl:message name="FahrenheitToCelsiusSoapOut">
    <wsdl:part name="parameters" element="tns:FahrenheitToCelsiusResponse" />
</wsdl:message>
<wsdl:message name="CelsiusToFahrenheitSoapIn">
    <wsdl:part name="parameters" element="tns:CelsiusToFahrenheit" />
</wsdl:message>
<wsdl:message name="CelsiusToFahrenheitSoapOut">
    <wsdl:part name="parameters" element="tns:CelsiusToFahrenheitResponse" />
</wsdl:message>
<wsdl:message name="FahrenheitToCelsiusHttpPostIn">
    <wsdl:part name="Fahrenheit" type="s:string" />
</wsdl:message>
<wsdl:message name="FahrenheitToCelsiusHttpPostOut">
    <wsdl:part name="Body" element="tns:string" />
</wsdl:message>
<wsdl:message name="CelsiusToFahrenheitHttpPostIn">
    <wsdl:part name="Celsius" type="s:string" />
</wsdl:message>
<wsdl:message name="CelsiusToFahrenheitHttpPostOut">
    <wsdl:part name="Body" element="tns:string" />
</wsdl:message>
<wsdl:portType name="TempConvertSoap">
    <wsdl:operation name="FahrenheitToCelsius">
        <wsdl:input message="tns:FahrenheitToCelsiusSoapIn" />
        <wsdl:output message="tns:FahrenheitToCelsiusSoapOut" />
    </wsdl:operation>
    <wsdl:operation name="CelsiusToFahrenheit">
        <wsdl:input message="tns:CelsiusToFahrenheitSoapIn" />
        <wsdl:output message="tns:CelsiusToFahrenheitSoapOut" />
    </wsdl:operation>
</wsdl:portType>
<wsdl:portType name="TempConvertHttpPost">
    <wsdl:operation name="FahrenheitToCelsius">
        <wsdl:input message="tns:FahrenheitToCelsiusHttpPostIn" />
        <wsdl:output message="tns:FahrenheitToCelsiusHttpPostOut" />
    </wsdl:operation>
    <wsdl:operation name="CelsiusToFahrenheit">
        <wsdl:input message="tns:CelsiusToFahrenheitHttpPostIn" />
        <wsdl:output message="tns:CelsiusToFahrenheitHttpPostOut" />
    </wsdl:operation>
</wsdl:portType>
<wsdl:binding name="TempConvertSoap" type="tns:TempConvertSoap">
    <soap:binding transport="http://schemas.xmlsoap.org/soap/http" />
    <wsdl:operation name="FahrenheitToCelsius">
        <soap:operation soapAction="https://www.w3schools.com/xml/FahrenheitToCelsius" style="document" />
        <wsdl:input>
            <soap:body use="literal" />
        </wsdl:input>
        <wsdl:output>
            <soap:body use="literal" />
        </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="CelsiusToFahrenheit">
        <soap:operation soapAction="https://www.w3schools.com/xml/CelsiusToFahrenheit" style="document" />
        <wsdl:input>
            <soap:body use="literal" />
        </wsdl:input>
        <wsdl:output>
            <soap:body use="literal" />
        </wsdl:output>
    </wsdl:operation>
</wsdl:binding>
<wsdl:binding name="TempConvertSoap12" type="tns:TempConvertSoap">
    <soap12:binding transport="http://schemas.xmlsoap.org/soap/http" />
    <wsdl:operation name="FahrenheitToCelsius">
        <soap12:operation soapAction="https://www.w3schools.com/xml/FahrenheitToCelsius" style="document" />
        <wsdl:input>
            <soap12:body use="literal" />
        </wsdl:input>
        <wsdl:output>
            <soap12:body use="literal" />
        </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="CelsiusToFahrenheit">
        <soap12:operation soapAction="https://www.w3schools.com/xml/CelsiusToFahrenheit" style="document" />
        <wsdl:input>
            <soap12:body use="literal" />
        </wsdl:input>
        <wsdl:output>
            <soap12:body use="literal" />
        </wsdl:output>
    </wsdl:operation>
</wsdl:binding>
<wsdl:binding name="TempConvertHttpPost" type="tns:TempConvertHttpPost">
    <http:binding verb="POST" />
    <wsdl:operation name="FahrenheitToCelsius">
        <http:operation location="/FahrenheitToCelsius" />
        <wsdl:input>
            <mime:content type="application/x-www-form-urlencoded" />
        </wsdl:input>
        <wsdl:output>
            <mime:mimeXml part="Body" />
        </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="CelsiusToFahrenheit">
        <http:operation location="/CelsiusToFahrenheit" />
        <wsdl:input>
            <mime:content type="application/x-www-form-urlencoded" />
        </wsdl:input>
        <wsdl:output>
            <mime:mimeXml part="Body" />
        </wsdl:output>
    </wsdl:operation>
</wsdl:binding>
<wsdl:service name="TempConvert">
    <wsdl:port name="TempConvertSoap" binding="tns:TempConvertSoap">
        <soap:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
    </wsdl:port>
    <wsdl:port name="TempConvertSoap12" binding="tns:TempConvertSoap12">
        <soap12:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
    </wsdl:port>
    <wsdl:port name="TempConvertHttpPost" binding="tns:TempConvertHttpPost">
        <http:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
    </wsdl:port>
</wsdl:service>
</wsdl:definitions>
`;

describe('WSDL 1.1 parser constructor', function () {
  it('should get an object wsdl 1.1 parser', function () {
    const parser = new Wsdl11Parser();
    expect(parser).to.be.an('object');
  });

});

describe('WSDL 1.1 parser assignNamespaces', function () {

  it('should assign namespaces to wsdl object', function () {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
   <service name="NumberConversion">
     <documentation>The Number Conversion Web Service, implemented with Visual DataFlex,
      provides functions that convert numbers into words or dollar amounts.</documentation>
     <port name="NumberConversionSoap" binding="tns:NumberConversionSoapBinding">
       <soap:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
     </port>
   </service>
 </definitions>`,
      parser = new Wsdl11Parser(),
      xmlParser = new XMLParser();
    let wsdlObject = new WsdlObject(),
      parsed = xmlParser.parseToObject(simpleInput);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);

    expect(wsdlObject).to.have.all.keys('targetNamespace',
      'wsdlNamespace', 'SOAPNamespace', 'HTTPNamespace',
      'SOAP12Namespace', 'schemaNamespace',
      'tnsNamespace', 'allNameSpaces', 'documentation', 'fileName', 'log',
      'operationsArray', 'securityPolicyArray',
      'securityPolicyNamespace', 'xmlParsed', 'version');

    expect(wsdlObject.targetNamespace.url).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(wsdlObject.tnsNamespace.url).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(wsdlObject.wsdlNamespace.key).to.equal('xmlns');
    expect(wsdlObject.SOAPNamespace.key).to.equal('soap');
    expect(wsdlObject.SOAP12Namespace.key).to.equal('soap12');
    expect(wsdlObject.schemaNamespace.key).to.equal('xs');
    expect(wsdlObject.schemaNamespace.prefixFilter).to.equal('xs:');

  });

});

describe('WSDL 1.1 parser assignSecurity', function () {
  it('Should return a wsdlObject with securityPolicyArray if file has security', function () {
    const parser = new Wsdl11Parser(),
      xmlParser = new XMLParser();
    fileContent = fs.readFileSync(numberConvertionSecurity, 'utf8');
    let wsdlObject = new WsdlObject(),
      parsed = xmlParser.parseToObject(fileContent);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    wsdlObject = parser.assignSecurity(wsdlObject, parsed);

    expect(wsdlObject).to.be.an('object').to.include.key('securityPolicyArray');
  });
});

describe('WSDL 1.1 parser getPortTypeOperations', function () {

  it('should get an array object representing port operations using default namespace', function () {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
      <types>
        <xs:schema elementFormDefault="qualified" 
        targetNamespace="http://www.dataaccess.com/webservicesserver/">
          <xs:element name="NumberToWords">
            <xs:complexType>
              <xs:sequence>
                <xs:element name="ubiNum" type="xs:unsignedLong"/>
              </xs:sequence>
            </xs:complexType>
          </xs:element>
          <xs:element name="NumberToWordsResponse">
            <xs:complexType>
              <xs:sequence>
                <xs:element name="NumberToWordsResult" type="xs:string"/>
              </xs:sequence>
            </xs:complexType>
          </xs:element>
          <xs:element name="NumberToDollars">
            <xs:complexType>
              <xs:sequence>
                <xs:element name="dNum" type="xs:decimal"/>
              </xs:sequence>
            </xs:complexType>
          </xs:element>
          <xs:element name="NumberToDollarsResponse">
            <xs:complexType>
              <xs:sequence>
                <xs:element name="NumberToDollarsResult" type="xs:string"/>
              </xs:sequence>
            </xs:complexType>
          </xs:element>
        </xs:schema>
      </types>
      <message name="NumberToWordsSoapRequest">
        <part name="parameters" element="tns:NumberToWords"/>
      </message>
      <message name="NumberToWordsSoapResponse">
        <part name="parameters" element="tns:NumberToWordsResponse"/>
      </message>
      <message name="NumberToDollarsSoapRequest">
        <part name="parameters" element="tns:NumberToDollars"/>
      </message>
      <message name="NumberToDollarsSoapResponse">
        <part name="parameters" element="tns:NumberToDollarsResponse"/>
      </message>
      <portType name="NumberConversionSoapType">
        <operation name="NumberToWords">
          <documentation>Returns the word corresponding to the 
          positive number passed as parameter. Limited to quadrillions.</documentation>
          <input message="tns:NumberToWordsSoapRequest"/>
          <output message="tns:NumberToWordsSoapResponse"/>
        </operation>
        <operation name="NumberToDollars">
          <documentation>Returns the non-zero dollar amount of the passed number.</documentation>
          <input message="tns:NumberToDollarsSoapRequest"/>
          <output message="tns:NumberToDollarsSoapResponse"/>
        </operation>
      </portType>
      <service name="NumberConversion">
        <documentation>The Number Conversion Web Service, 
        implemented with Visual DataFlex, provides 
        functions that convert numbers into words or dollar amounts.</documentation>
        <port name="NumberConversionSoap" binding="tns:NumberConversionSoapBinding">
          <soap:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
        </port>
        <port name="NumberConversionSoap12" binding="tns:NumberConversionSoapBinding12">
          <soap12:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
        </port>
      </service>
    </definitions>`,
      parser = new Wsdl11Parser(),
      xmlParser = new XMLParser();
    let parsed = xmlParser.parseToObject(simpleInput),
      portTypeOperations = parser.getPortTypeOperations(
        parsed
      );
    expect(portTypeOperations).to.be.an('array');
    expect(portTypeOperations.length).to.equal(2);
  });

  it('should get array object representing port operations using default namespace and portypes has operations',
    function () {
      const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/"
     name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
    <portType name="DiscoveryServicePort">
      <operation name="query">
       <input message="cmisw:queryRequest" />
       <output message="cmisw:queryResponse" />
       <fault message="cmisw:cmisException" name="cmisException" />
     </operation>
     <operation name="getContentChanges">
       <input message="cmisw:getContentChangesRequest" />
       <output message="cmisw:getContentChangesResponse" />
       <fault message="cmisw:cmisException" name="cmisException" />
     </operation>
   </portType>
   <portType name="MultiFilingServicePort">
     <operation name="addObjectToFolder">
       <input message="cmisw:addObjectToFolderRequest" />
       <output message="cmisw:addObjectToFolderResponse" />
       <fault message="cmisw:cmisException" name="cmisException" />
     </operation>
     <operation name="removeObjectFromFolder">
       <input message="cmisw:removeObjectFromFolderRequest" />
       <output message="cmisw:removeObjectFromFolderResponse" />
       <fault message="cmisw:cmisException" name="cmisException" />
     </operation>
   </portType>
      <service name="NumberConversion">
        <documentation>The Number Conversion Web Service, implemented with Visual DataFlex,
         provides functions that convert numbers into words or dollar amounts.</documentation>
        <port name="NumberConversionSoap" binding="tns:NumberConversionSoapBinding">
          <soap:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
        </port>
        <port name="NumberConversionSoap12" binding="tns:NumberConversionSoapBinding12">
          <soap12:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
        </port>
      </service>
    </definitions>`,
        parser = new Wsdl11Parser(),
        xmlParser = new XMLParser();
      let parsed = xmlParser.parseToObject(simpleInput),
        portTypeOperations = parser.getPortTypeOperations(
          parsed
        );
      expect(portTypeOperations).to.be.an('array');
      expect(portTypeOperations.length).to.equal(4);
    });

  it('should get array object representing port operations using default ns when portypes many and one operations',
    function () {
      const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/"
     name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
    <portType name="DiscoveryServicePort">
      <operation name="query">
       <input message="cmisw:queryRequest" />
       <output message="cmisw:queryResponse" />
       <fault message="cmisw:cmisException" name="cmisException" />
     </operation>
     <operation name="getContentChanges">
       <input message="cmisw:getContentChangesRequest" />
       <output message="cmisw:getContentChangesResponse" />
       <fault message="cmisw:cmisException" name="cmisException" />
     </operation>
   </portType>
   <portType name="MultiFilingServicePort">
     <operation name="addObjectToFolder">
       <input message="cmisw:addObjectToFolderRequest" />
       <output message="cmisw:addObjectToFolderResponse" />
       <fault message="cmisw:cmisException" name="cmisException" />
     </operation>
   </portType>
      <service name="NumberConversion">
        <documentation>The Number Conversion Web Service, 
        implemented with Visual DataFlex, provides functions
         that convert numbers into words or dollar amounts.</documentation>
        <port name="NumberConversionSoap" binding="tns:NumberConversionSoapBinding">
          <soap:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
        </port>
        <port name="NumberConversionSoap12" binding="tns:NumberConversionSoapBinding12">
          <soap12:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
        </port>
      </service>
    </definitions>`,
        parser = new Wsdl11Parser(),
        xmlParser = new XMLParser();
      let parsed = xmlParser.parseToObject(simpleInput),
        portTypeOperations = parser.getPortTypeOperations(
          parsed
        );
      expect(portTypeOperations).to.be.an('array');
      expect(portTypeOperations.length).to.equal(3);
    });

  it('should get an array object representing port operations using named namespace <wsdl:definitions>', function () {
    const simpleInput = `<wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:tns="http://tempuri.org/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http" 
    xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" 
    xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy"
     xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" 
     xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://tempuri.org/" name="ISampleService">
    <wsdl:message name="ISampleService_Test_InputMessage">
        <wsdl:part name="parameters" element="tns:Test" />
    </wsdl:message>
    <wsdl:message name="ISampleService_Test_OutputMessage">
        <wsdl:part name="parameters" element="tns:TestResponse" />
    </wsdl:message>
    <wsdl:message name="ISampleService_XmlMethod_InputMessage">
        <wsdl:part name="parameters" element="tns:XmlMethod" />
    </wsdl:message>
    <wsdl:message name="ISampleService_XmlMethod_OutputMessage">
        <wsdl:part name="parameters" element="tns:XmlMethodResponse" />
    </wsdl:message>
    <wsdl:message name="ISampleService_TestCustomModel_InputMessage">
        <wsdl:part name="parameters" element="tns:TestCustomModel" />
    </wsdl:message>
    <wsdl:message name="ISampleService_TestCustomModel_OutputMessage">
        <wsdl:part name="parameters" element="tns:TestCustomModelResponse" />
    </wsdl:message>
    <wsdl:portType name="ISampleService">
        <wsdl:operation name="Test">
            <wsdl:input message="tns:ISampleService_Test_InputMessage" />
            <wsdl:output message="tns:ISampleService_Test_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <wsdl:input message="tns:ISampleService_XmlMethod_InputMessage" />
            <wsdl:output message="tns:ISampleService_XmlMethod_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <wsdl:input message="tns:ISampleService_TestCustomModel_InputMessage" />
            <wsdl:output message="tns:ISampleService_TestCustomModel_OutputMessage" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="BasicHttpBinding" type="tns:ISampleService">
        <soap:binding transport="http://schemas.xmlsoap.org/soap/http" />
        <wsdl:operation name="Test">
            <soap:operation soapAction="http://tempuri.org/ISampleService/Test" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <soap:operation soapAction="http://tempuri.org/ISampleService/XmlMethod" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <soap:operation soapAction="http://tempuri.org/ISampleService/TestCustomModel" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="ISampleService">
        <wsdl:port name="BasicHttpBinding" binding="tns:BasicHttpBinding">
            <soap:address location="https://localhost:5001/Service.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      parser = new Wsdl11Parser(),
      xmlParser = new XMLParser();
    let parsed = xmlParser.parseToObject(simpleInput),
      portTypeOperations = parser.getPortTypeOperations(
        parsed
      );
    expect(portTypeOperations).to.be.an('array');
    expect(portTypeOperations.length).to.equal(3);
  });

  it('should throw an error when call with null', function () {
    const parser = new Wsdl11Parser();
    try {
      parser.getPortTypeOperations(
        null
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get portypes from undefined or null object');
    }
  });

  it('should throw an error when call with undefined', function () {
    const parser = new Wsdl11Parser();
    try {
      parser.getPortTypeOperations(
        undefined
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get portypes from undefined or null object');
    }
  });

  it('should throw an error when call with an empty object', function () {
    const parser = new Wsdl11Parser();
    try {
      parser.getPortTypeOperations({});
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get portypes from object');
    }
  });
});

describe('WSDL 1.1 parser getBindingInfoFromBindingTag', function () {
  it('should get info from binding for soap when binding is soap', function () {

    const simpleInput = `<wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:tns="http://tempuri.org/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http" 
    xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" 
    xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" 
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" 
    xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://tempuri.org/" name="ISampleService">
    <wsdl:portType name="ISampleService">
        <wsdl:operation name="Test">
            <wsdl:input message="tns:ISampleService_Test_InputMessage" />
            <wsdl:output message="tns:ISampleService_Test_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <wsdl:input message="tns:ISampleService_XmlMethod_InputMessage" />
            <wsdl:output message="tns:ISampleService_XmlMethod_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <wsdl:input message="tns:ISampleService_TestCustomModel_InputMessage" />
            <wsdl:output message="tns:ISampleService_TestCustomModel_OutputMessage" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="BasicHttpBinding" type="tns:ISampleService">
        <soap:binding transport="http://schemas.xmlsoap.org/soap/http" />
        <wsdl:operation name="Test">
            <soap:operation soapAction="http://tempuri.org/ISampleService/Test" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <soap:operation soapAction="http://tempuri.org/ISampleService/XmlMethod" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <soap:operation soapAction="http://tempuri.org/ISampleService/TestCustomModel" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="ISampleService">
        <wsdl:port name="BasicHttpBinding" binding="tns:BasicHttpBinding">
            <soap:address location="https://localhost:5001/Service.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      parser = new Wsdl11Parser(),
      xmlParser = new XMLParser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = xmlParser.parseToObject(simpleInput),
      binding = getBindings(
        parsed,
        WSDL_ROOT
      )[0],
      bindingInfo = parser.getBindingInfoFromBindingTag(binding, soapNamespace, soap12Namespace);
    expect(bindingInfo.protocol).to.equal(SOAP_PROTOCOL);
    expect(bindingInfo.verb).to.equal(POST_METHOD);

  });

  it('should get info from binding for soap when binding is soap12', function () {

    const simpleInput = `<wsdl:definitions xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://tempuri.org/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http" 
    xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" 
    xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" 
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" 
    xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://tempuri.org/" name="ISampleService">
    <wsdl:portType name="ISampleService">
        <wsdl:operation name="Test">
            <wsdl:input message="tns:ISampleService_Test_InputMessage" />
            <wsdl:output message="tns:ISampleService_Test_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <wsdl:input message="tns:ISampleService_XmlMethod_InputMessage" />
            <wsdl:output message="tns:ISampleService_XmlMethod_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <wsdl:input message="tns:ISampleService_TestCustomModel_InputMessage" />
            <wsdl:output message="tns:ISampleService_TestCustomModel_OutputMessage" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="BasicHttpBinding" type="tns:ISampleService">
        <soap12:binding transport="http://schemas.xmlsoap.org/soap12/http" />
        <wsdl:operation name="Test">
            <soap:operation soapAction="http://tempuri.org/ISampleService/Test" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <soap:operation soapAction="http://tempuri.org/ISampleService/XmlMethod" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <soap:operation soapAction="http://tempuri.org/ISampleService/TestCustomModel" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="ISampleService">
        <wsdl:port name="BasicHttpBinding" binding="tns:BasicHttpBinding">
            <soap:address location="https://localhost:5001/Service.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      parser = new Wsdl11Parser(),
      xmlParser = new XMLParser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = xmlParser.parseToObject(simpleInput),
      binding = getBindings(
        parsed,
        WSDL_ROOT
      )[0],
      bindingInfo = parser.getBindingInfoFromBindingTag(binding, soapNamespace, soap12Namespace);
    expect(bindingInfo.protocol).to.equal(SOAP12_PROTOCOL);
    expect(bindingInfo.verb).to.equal(POST_METHOD);

  });

  it('should get info from binding for soap when binding is http', function () {

    const simpleInput = `<wsdl:definitions 
    xmlns:tm="http://microsoft.com/wsdl/mime/textMatching/"
     xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"
      xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/" 
      xmlns:tns="https://www.w3schools.com/xml/" 
      xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
      xmlns:s="http://www.w3.org/2001/XMLSchema" 
      xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/"
      xmlns:http="http://schemas.xmlsoap.org/wsdl/http/" 
      xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" 
      targetNamespace="https://www.w3schools.com/xml/">
    <wsdl:binding name="TempConvertHttpPost" type="tns:TempConvertHttpPost">
        <http:binding verb="POST" />
        <wsdl:operation name="FahrenheitToCelsius">
            <http:operation location="/FahrenheitToCelsius" />
            <wsdl:input>
                <mime:content type="application/x-www-form-urlencoded" />
            </wsdl:input>
            <wsdl:output>
                <mime:mimeXml part="Body" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="CelsiusToFahrenheit">
            <http:operation location="/CelsiusToFahrenheit" />
            <wsdl:input>
                <mime:content type="application/x-www-form-urlencoded" />
            </wsdl:input>
            <wsdl:output>
                <mime:mimeXml part="Body" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="TempConvert">
        <wsdl:port name="TempConvertSoap" binding="tns:TempConvertSoap">
            <soap:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
        <wsdl:port name="TempConvertSoap12" binding="tns:TempConvertSoap12">
            <soap12:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
        <wsdl:port name="TempConvertHttpPost" binding="tns:TempConvertHttpPost">
            <http:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      parser = new Wsdl11Parser(),
      xmlParser = new XMLParser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      httpNamespace = {
        key: 'http',
        url: 'http://schemas.xmlsoap.org/wsdl/http/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = xmlParser.parseToObject(simpleInput),
      binding = getBindings(
        parsed,
        WSDL_ROOT
      )[0],
      bindingInfo = parser.getBindingInfoFromBindingTag(binding, soapNamespace, soap12Namespace, httpNamespace);
    expect(bindingInfo.protocol).to.equal(HTTP_PROTOCOL);
    expect(bindingInfo.verb).to.equal(POST_METHOD);

  });

  it('should throw an error when call getBindingInfoFromBindingTag with binding null', function () {
    const parser = new Wsdl11Parser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    try {
      parser.getBindingInfoFromBindingTag(
        null,
        soapNamespace, soap12Namespace
      );
    }
    catch (error) {
      expect(error.message).to.equal('Can not get binding info from undefined or null object');
    }
  });

  it('should throw an error when call getBindingInfoFromBindingTag with binding undefined', function () {
    const parser = new Wsdl11Parser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    try {
      parser.getBindingInfoFromBindingTag(
        undefined,
        soapNamespace, soap12Namespace
      );
    }
    catch (error) {
      expect(error.message).to.equal('Can not get binding info from undefined or null object');
    }
  });

  it('should throw an error when call getBindingInfoFromBindingTag with binding an empty object', function () {
    const parser = new Wsdl11Parser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    try {
      parser.getBindingInfoFromBindingTag({},
        soapNamespace, soap12Namespace
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get binding from object');
    }
  });

  it('should throw an error when can not get protocol', function () {
    const simpleInput = `<wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:tns="http://tempuri.org/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http" 
    xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" 
    xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" 
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" 
    xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://tempuri.org/" name="ISampleService">
    <wsdl:portType name="ISampleService">
        <wsdl:operation name="Test">
            <wsdl:input message="tns:ISampleService_Test_InputMessage" />
            <wsdl:output message="tns:ISampleService_Test_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <wsdl:input message="tns:ISampleService_XmlMethod_InputMessage" />
            <wsdl:output message="tns:ISampleService_XmlMethod_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <wsdl:input message="tns:ISampleService_TestCustomModel_InputMessage" />
            <wsdl:output message="tns:ISampleService_TestCustomModel_OutputMessage" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="BasicHttpBinding" type="tns:ISampleService">
        <soap:binding transport="http://schemas.xmlsoap.org/soap/http" />
        <wsdl:operation name="Test">
            <soap:operation soapAction="http://tempuri.org/ISampleService/Test" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <soap:operation soapAction="http://tempuri.org/ISampleService/XmlMethod" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <soap:operation soapAction="http://tempuri.org/ISampleService/TestCustomModel" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="ISampleService">
        <wsdl:port name="BasicHttpBinding" binding="tns:BasicHttpBinding">
            <soap:address location="https://localhost:5001/Service.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      parser = new Wsdl11Parser(),
      xmlParser = new XMLParser();
    try {
      let parsed = xmlParser.parseToObject(simpleInput),
        binding = getBindings(
          parsed,
          WSDL_ROOT
        )[0];
      parser.getBindingInfoFromBindingTag(binding, undefined, undefined);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not find protocol in those namespaces');
    }
  });

  it('should get info from binding for soap when binding is soap and soap12 is not send', function () {

    const simpleInput = `<wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:tns="http://tempuri.org/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http" 
    xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" 
    xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" 
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" 
    xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://tempuri.org/" name="ISampleService">
    <wsdl:portType name="ISampleService">
        <wsdl:operation name="Test">
            <wsdl:input message="tns:ISampleService_Test_InputMessage" />
            <wsdl:output message="tns:ISampleService_Test_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <wsdl:input message="tns:ISampleService_XmlMethod_InputMessage" />
            <wsdl:output message="tns:ISampleService_XmlMethod_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <wsdl:input message="tns:ISampleService_TestCustomModel_InputMessage" />
            <wsdl:output message="tns:ISampleService_TestCustomModel_OutputMessage" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="BasicHttpBinding" type="tns:ISampleService">
        <soap:binding transport="http://schemas.xmlsoap.org/soap/http" />
        <wsdl:operation name="Test">
            <soap:operation soapAction="http://tempuri.org/ISampleService/Test" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <soap:operation soapAction="http://tempuri.org/ISampleService/XmlMethod" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <soap:operation soapAction="http://tempuri.org/ISampleService/TestCustomModel" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="ISampleService">
        <wsdl:port name="BasicHttpBinding" binding="tns:BasicHttpBinding">
            <soap:address location="https://localhost:5001/Service.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      parser = new Wsdl11Parser(),
      xmlParser = new XMLParser(),
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = xmlParser.parseToObject(simpleInput),
      binding = getBindings(
        parsed,
        WSDL_ROOT
      )[0],
      bindingInfo = parser.getBindingInfoFromBindingTag(binding, soapNamespace, null);
    expect(bindingInfo.protocol).to.equal(SOAP_PROTOCOL);
    expect(bindingInfo.verb).to.equal(POST_METHOD);

  });

});

describe('WSDL 1.1 parser getStyleFromBindingOperation', function () {
  it('should get style from binding operation when binding is soap', function () {

    const simpleInput = `<wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:tns="http://tempuri.org/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http" 
    xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" 
    xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" 
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" 
    xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://tempuri.org/" name="ISampleService">
    <wsdl:portType name="ISampleService">
        <wsdl:operation name="Test">
            <wsdl:input message="tns:ISampleService_Test_InputMessage" />
            <wsdl:output message="tns:ISampleService_Test_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <wsdl:input message="tns:ISampleService_XmlMethod_InputMessage" />
            <wsdl:output message="tns:ISampleService_XmlMethod_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <wsdl:input message="tns:ISampleService_TestCustomModel_InputMessage" />
            <wsdl:output message="tns:ISampleService_TestCustomModel_OutputMessage" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="BasicHttpBinding" type="tns:ISampleService">
        <soap:binding transport="http://schemas.xmlsoap.org/soap/http" />
        <wsdl:operation name="Test">
            <soap:operation soapAction="http://tempuri.org/ISampleService/Test" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <soap:operation soapAction="http://tempuri.org/ISampleService/XmlMethod" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <soap:operation soapAction="http://tempuri.org/ISampleService/TestCustomModel" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="ISampleService">
        <wsdl:port name="BasicHttpBinding" binding="tns:BasicHttpBinding">
            <soap:address location="https://localhost:5001/Service.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      parser = new Wsdl11Parser(),
      xmlParser = new XMLParser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = xmlParser.parseToObject(simpleInput),
      binding = getBindings(
        parsed,
        WSDL_ROOT
      )[0],
      bindingInfo = parser.getBindingInfoFromBindingTag(binding, soapNamespace, soap12Namespace),
      operation = {};
    operation['soap:operation'] = {
      '@_style': 'document'
    };
    expect(parser.getStyleFromBindingOperation(operation, bindingInfo)).to.equal('document');
  });

  it('should get style from binding operation when binding is soap 12', function () {

    const simpleInput = `<wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:tns="http://tempuri.org/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http" 
    xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" 
    xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" 
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" 
    xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://tempuri.org/" name="ISampleService">
    <wsdl:portType name="ISampleService">
        <wsdl:operation name="Test">
            <wsdl:input message="tns:ISampleService_Test_InputMessage" />
            <wsdl:output message="tns:ISampleService_Test_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <wsdl:input message="tns:ISampleService_XmlMethod_InputMessage" />
            <wsdl:output message="tns:ISampleService_XmlMethod_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <wsdl:input message="tns:ISampleService_TestCustomModel_InputMessage" />
            <wsdl:output message="tns:ISampleService_TestCustomModel_OutputMessage" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="BasicHttpBinding" type="tns:ISampleService">
        <soap12:binding transport="http://schemas.xmlsoap.org/soap/http" />
        <wsdl:operation name="Test">
            <soap12:operation soapAction="http://tempuri.org/ISampleService/Test" style="document" />
            <wsdl:input>
                <soap12:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap12:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <soap12:operation soapAction="http://tempuri.org/ISampleService/XmlMethod" style="document" />
            <wsdl:input>
                <soap12:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap12:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <soap:operation soapAction="http://tempuri.org/ISampleService/TestCustomModel" style="document" />
            <wsdl:input>
                <soap12:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap12:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="ISampleService">
        <wsdl:port name="BasicHttpBinding" binding="tns:BasicHttpBinding">
            <soap:address location="https://localhost:5001/Service.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      parser = new Wsdl11Parser(),
      xmlParser = new XMLParser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = xmlParser.parseToObject(simpleInput),
      binding = getBindings(
        parsed,
        WSDL_ROOT
      )[0],
      bindingInfo = parser.getBindingInfoFromBindingTag(binding, soapNamespace, soap12Namespace),
      operation = {};
    operation['soap12:operation'] = {
      '@_style': 'document'
    };
    expect(parser.getStyleFromBindingOperation(operation, bindingInfo)).to.equal('document');

  });

  it('should get style from binding operation when binding is http', function () {

    const simpleInput = `<wsdl:definitions xmlns:tm="http://microsoft.com/wsdl/mime/textMatching/" 
    xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" 
    xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/" 
    xmlns:tns="https://www.w3schools.com/xml/" 
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:s="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:http="http://schemas.xmlsoap.org/wsdl/http/" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" 
    targetNamespace="https://www.w3schools.com/xml/">
    <wsdl:portType name="TempConvertSoap">
        <wsdl:operation name="FahrenheitToCelsius">
            <wsdl:input message="tns:FahrenheitToCelsiusSoapIn" />
            <wsdl:output message="tns:FahrenheitToCelsiusSoapOut" />
        </wsdl:operation>
        <wsdl:operation name="CelsiusToFahrenheit">
            <wsdl:input message="tns:CelsiusToFahrenheitSoapIn" />
            <wsdl:output message="tns:CelsiusToFahrenheitSoapOut" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:portType name="TempConvertHttpPost">
        <wsdl:operation name="FahrenheitToCelsius">
            <wsdl:input message="tns:FahrenheitToCelsiusHttpPostIn" />
            <wsdl:output message="tns:FahrenheitToCelsiusHttpPostOut" />
        </wsdl:operation>
        <wsdl:operation name="CelsiusToFahrenheit">
            <wsdl:input message="tns:CelsiusToFahrenheitHttpPostIn" />
            <wsdl:output message="tns:CelsiusToFahrenheitHttpPostOut" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="TempConvertHttpPost" type="tns:TempConvertHttpPost">
        <http:binding verb="POST" />
        <wsdl:operation name="FahrenheitToCelsius">
            <http:operation location="/FahrenheitToCelsius" />
            <wsdl:input>
                <mime:content type="application/x-www-form-urlencoded" />
            </wsdl:input>
            <wsdl:output>
                <mime:mimeXml part="Body" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="CelsiusToFahrenheit">
            <http:operation location="/CelsiusToFahrenheit" />
            <wsdl:input>
                <mime:content type="application/x-www-form-urlencoded" />
            </wsdl:input>
            <wsdl:output>
                <mime:mimeXml part="Body" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="TempConvert">
        <wsdl:port name="TempConvertSoap" binding="tns:TempConvertSoap">
            <soap:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
        <wsdl:port name="TempConvertSoap12" binding="tns:TempConvertSoap12">
            <soap12:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
        <wsdl:port name="TempConvertHttpPost" binding="tns:TempConvertHttpPost">
            <http:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      parser = new Wsdl11Parser(),
      xmlParser = new XMLParser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      httpNamespace = {
        key: 'http',
        url: 'http://schemas.xmlsoap.org/wsdl/http/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = xmlParser.parseToObject(simpleInput),
      binding = getBindings(
        parsed,
        WSDL_ROOT
      )[0],
      bindingInfo = parser.getBindingInfoFromBindingTag(binding, soapNamespace, soap12Namespace, httpNamespace),
      operation = {};
    operation['http:operation'] = {
      '@_location': '/FahrenheitToCelsius'
    };
    expect(parser.getStyleFromBindingOperation(operation, bindingInfo)).to.equal('');

  });

  it('should throw an error when called with operation null', function () {

    const simpleInput = `<wsdl:definitions xmlns:tm="http://microsoft.com/wsdl/mime/textMatching/" 
    xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" 
    xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/" 
    xmlns:tns="https://www.w3schools.com/xml/" 
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:s="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:http="http://schemas.xmlsoap.org/wsdl/http/" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" 
    targetNamespace="https://www.w3schools.com/xml/">
    <wsdl:portType name="TempConvertSoap">
        <wsdl:operation name="FahrenheitToCelsius">
            <wsdl:input message="tns:FahrenheitToCelsiusSoapIn" />
            <wsdl:output message="tns:FahrenheitToCelsiusSoapOut" />
        </wsdl:operation>
        <wsdl:operation name="CelsiusToFahrenheit">
            <wsdl:input message="tns:CelsiusToFahrenheitSoapIn" />
            <wsdl:output message="tns:CelsiusToFahrenheitSoapOut" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:portType name="TempConvertHttpPost">
        <wsdl:operation name="FahrenheitToCelsius">
            <wsdl:input message="tns:FahrenheitToCelsiusHttpPostIn" />
            <wsdl:output message="tns:FahrenheitToCelsiusHttpPostOut" />
        </wsdl:operation>
        <wsdl:operation name="CelsiusToFahrenheit">
            <wsdl:input message="tns:CelsiusToFahrenheitHttpPostIn" />
            <wsdl:output message="tns:CelsiusToFahrenheitHttpPostOut" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="TempConvertHttpPost" type="tns:TempConvertHttpPost">
        <http:binding verb="POST" />
        <wsdl:operation name="FahrenheitToCelsius">
            <http:operation location="/FahrenheitToCelsius" />
            <wsdl:input>
                <mime:content type="application/x-www-form-urlencoded" />
            </wsdl:input>
            <wsdl:output>
                <mime:mimeXml part="Body" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="CelsiusToFahrenheit">
            <http:operation location="/CelsiusToFahrenheit" />
            <wsdl:input>
                <mime:content type="application/x-www-form-urlencoded" />
            </wsdl:input>
            <wsdl:output>
                <mime:mimeXml part="Body" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="TempConvert">
        <wsdl:port name="TempConvertSoap" binding="tns:TempConvertSoap">
            <soap:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
        <wsdl:port name="TempConvertSoap12" binding="tns:TempConvertSoap12">
            <soap12:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
        <wsdl:port name="TempConvertHttpPost" binding="tns:TempConvertHttpPost">
            <http:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      parser = new Wsdl11Parser(),
      xmlParser = new XMLParser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      httpNamespace = {
        key: 'http',
        url: 'http://schemas.xmlsoap.org/wsdl/http/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = xmlParser.parseToObject(simpleInput),
      binding = getBindings(
        parsed,
        WSDL_ROOT
      )[0],
      bindingInfo = parser.getBindingInfoFromBindingTag(binding, soapNamespace, soap12Namespace, httpNamespace),

      operation = {};
    operation['http:operation'] = {
      '@_location': '/FahrenheitToCelsius'
    };
    try {
      parser.getStyleFromBindingOperation(null, bindingInfo);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get style info from binding operation undefined or null object');
    }
  });

  it('should throw an error when called with operation undefined', function () {

    const simpleInput = `<wsdl:definitions xmlns:tm="http://microsoft.com/wsdl/mime/textMatching/" 
    xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" 
    xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/" 
    xmlns:tns="https://www.w3schools.com/xml/" 
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:s="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:http="http://schemas.xmlsoap.org/wsdl/http/" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" 
    targetNamespace="https://www.w3schools.com/xml/">
    <wsdl:portType name="TempConvertSoap">
        <wsdl:operation name="FahrenheitToCelsius">
            <wsdl:input message="tns:FahrenheitToCelsiusSoapIn" />
            <wsdl:output message="tns:FahrenheitToCelsiusSoapOut" />
        </wsdl:operation>
        <wsdl:operation name="CelsiusToFahrenheit">
            <wsdl:input message="tns:CelsiusToFahrenheitSoapIn" />
            <wsdl:output message="tns:CelsiusToFahrenheitSoapOut" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:portType name="TempConvertHttpPost">
        <wsdl:operation name="FahrenheitToCelsius">
            <wsdl:input message="tns:FahrenheitToCelsiusHttpPostIn" />
            <wsdl:output message="tns:FahrenheitToCelsiusHttpPostOut" />
        </wsdl:operation>
        <wsdl:operation name="CelsiusToFahrenheit">
            <wsdl:input message="tns:CelsiusToFahrenheitHttpPostIn" />
            <wsdl:output message="tns:CelsiusToFahrenheitHttpPostOut" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="TempConvertHttpPost" type="tns:TempConvertHttpPost">
        <http:binding verb="POST" />
        <wsdl:operation name="FahrenheitToCelsius">
            <http:operation location="/FahrenheitToCelsius" />
            <wsdl:input>
                <mime:content type="application/x-www-form-urlencoded" />
            </wsdl:input>
            <wsdl:output>
                <mime:mimeXml part="Body" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="CelsiusToFahrenheit">
            <http:operation location="/CelsiusToFahrenheit" />
            <wsdl:input>
                <mime:content type="application/x-www-form-urlencoded" />
            </wsdl:input>
            <wsdl:output>
                <mime:mimeXml part="Body" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="TempConvert">
        <wsdl:port name="TempConvertSoap" binding="tns:TempConvertSoap">
            <soap:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
        <wsdl:port name="TempConvertSoap12" binding="tns:TempConvertSoap12">
            <soap12:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
        <wsdl:port name="TempConvertHttpPost" binding="tns:TempConvertHttpPost">
            <http:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      parser = new Wsdl11Parser(),
      xmlParser = new XMLParser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      httpNamespace = {
        key: 'http',
        url: 'http://schemas.xmlsoap.org/wsdl/http/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = xmlParser.parseToObject(simpleInput),
      binding = getBindings(
        parsed,
        WSDL_ROOT
      )[0],
      bindingInfo = parser.getBindingInfoFromBindingTag(binding, soapNamespace, soap12Namespace, httpNamespace),

      operation = {};
    operation['http:operation'] = {
      '@_location': '/FahrenheitToCelsius'
    };
    try {
      parser.getStyleFromBindingOperation(undefined, bindingInfo);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get style info from binding operation undefined or null object');
    }
  });

  it('should throw an error when called with operation as empty object', function () {

    const simpleInput = `<wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:tns="http://tempuri.org/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http" 
    xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" 
    xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" 
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" 
    xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://tempuri.org/" name="ISampleService">
    <wsdl:portType name="ISampleService">
        <wsdl:operation name="Test">
            <wsdl:input message="tns:ISampleService_Test_InputMessage" />
            <wsdl:output message="tns:ISampleService_Test_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <wsdl:input message="tns:ISampleService_XmlMethod_InputMessage" />
            <wsdl:output message="tns:ISampleService_XmlMethod_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <wsdl:input message="tns:ISampleService_TestCustomModel_InputMessage" />
            <wsdl:output message="tns:ISampleService_TestCustomModel_OutputMessage" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="BasicHttpBinding" type="tns:ISampleService">
        <soap12:binding transport="http://schemas.xmlsoap.org/soap/http" />
        <wsdl:operation name="Test">
            <soap12:operation soapAction="http://tempuri.org/ISampleService/Test" style="document" />
            <wsdl:input>
                <soap12:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap12:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <soap12:operation soapAction="http://tempuri.org/ISampleService/XmlMethod" style="document" />
            <wsdl:input>
                <soap12:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap12:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <soap:operation soapAction="http://tempuri.org/ISampleService/TestCustomModel" style="document" />
            <wsdl:input>
                <soap12:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap12:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="ISampleService">
        <wsdl:port name="BasicHttpBinding" binding="tns:BasicHttpBinding">
            <soap:address location="https://localhost:5001/Service.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      parser = new Wsdl11Parser(),
      xmlParser = new XMLParser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      httpNamespace = {
        key: 'http',
        url: 'http://schemas.xmlsoap.org/wsdl/http/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = xmlParser.parseToObject(simpleInput),
      binding = getBindings(
        parsed,
        WSDL_ROOT
      )[0],
      bindingInfo = parser.getBindingInfoFromBindingTag(binding, soapNamespace, soap12Namespace, httpNamespace);
    try {
      parser.getStyleFromBindingOperation({}, bindingInfo);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get style info from binding operation');
    }
  });
});

describe('WSDL 1.1 parser assignOperations', function () {
  it('should assign operations to wsdl object', function () {
    const parser = new Wsdl11Parser(),
      xmlParser = new XMLParser();
    let wsdlObject = new WsdlObject(),
      parsed = xmlParser.parseToObject(NUMBERCONVERSION_INPUT);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(4);

    expect(wsdlObject.operationsArray[0]).to.be.an('object')
      .and.to.deep.include({
        name: 'NumberToWords',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap',
        serviceName: 'NumberConversion',
        xpathInfo: {
          xpath: '//definitions//binding[@name="NumberConversionSoapBinding"]' +
            '//operation[@name="NumberToWords"]',
          wsdlNamespaceUrl: 'http://schemas.xmlsoap.org/wsdl/'
        }
      });

    expect(wsdlObject.operationsArray[0].description.replace(/[\r\n\s]+/g, '')).to.equal(
      ('Returns the word corresponding to the positive number ' +
        'passed as parameter. Limited to quadrillions.').replace(/[\r\n\s]+/g, ''));

    expect(wsdlObject.operationsArray[1]).to.be.an('object')
      .and.to.deep.include({
        name: 'NumberToDollars',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap',
        serviceName: 'NumberConversion',
        xpathInfo: {
          xpath: '//definitions//binding[@name="NumberConversionSoapBinding"]' +
            '//operation[@name="NumberToDollars"]',
          wsdlNamespaceUrl: 'http://schemas.xmlsoap.org/wsdl/'
        }
      });

    expect(wsdlObject.operationsArray[2]).to.be.an('object')
      .and.to.deep.include({
        name: 'NumberToWords',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap12',
        serviceName: 'NumberConversion',
        xpathInfo: {
          xpath:
            '//definitions//binding[@name="NumberConversionSoapBinding12"]//operation[@name="NumberToWords"]',
          wsdlNamespaceUrl: 'http://schemas.xmlsoap.org/wsdl/'
        }
      });

    expect(wsdlObject.operationsArray[3]).to.be.an('object')
      .and.to.deep.include({
        name: 'NumberToDollars',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap12',
        serviceName: 'NumberConversion',
        xpathInfo: {
          xpath: '//definitions//binding[@name="NumberConversionSoapBinding12"]' +
            '//operation[@name="NumberToDollars"]',
          wsdlNamespaceUrl: 'http://schemas.xmlsoap.org/wsdl/'
        }
      });
  });

  it('should assign operations to wsdl object with fault messages', function () {
    const inputFile = `
  <?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
xmlns:xs="http://www.w3.org/2001/XMLSchema" 
xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
<types>
<xs:schema elementFormDefault="qualified" targetNamespace="http://www.dataaccess.com/webservicesserver/">
  <xs:element name="NumberToWords">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="ubiNum" type="xs:unsignedLong"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
  <xs:element name="NumberToWordsResponse">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="NumberToWordsResult" type="xs:string"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
  <xs:element name="NumberToDollars">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="dNum" type="xs:decimal"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
  <xs:element name="NumberToDollarsResponse">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="NumberToDollarsResult" type="xs:string"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>
</types>
<message name="NumberToWordsSoapRequest">
<part name="parameters" element="tns:NumberToWords"/>
</message>
<message name="NumberToWordsSoapResponse">
<part name="parameters" element="tns:NumberToWordsResponse"/>
</message>
<message name="NumberToDollarsSoapRequest">
<part name="parameters" element="tns:NumberToDollars"/>
</message>
<message name="NumberToDollarsSoapResponse">
<part name="parameters" element="tns:NumberToDollarsResponse"/>
</message>
<portType name="NumberConversionSoapType">
<operation name="NumberToWords">
  <documentation>Returns the word corresponding 
  to the positive number passed as parameter. Limited to quadrillions.</documentation>
  <input message="tns:NumberToWordsSoapRequest"/>
  <output message="tns:NumberToWordsSoapResponse"/>
  <fault message="tns:NumberToWordsSoapResponse"/>
</operation>
<operation name="NumberToDollars">
  <documentation>Returns the non-zero dollar amount of the passed number.</documentation>
  <input message="tns:NumberToDollarsSoapRequest"/>
  <output message="tns:NumberToDollarsSoapResponse"/>
</operation>
</portType>
<binding name="NumberConversionSoapBinding" type="tns:NumberConversionSoapType">
<soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
<operation name="NumberToWords">
  <soap:operation soapAction="" style="document"/>
  <input>
    <soap:body use="literal"/>
  </input>
  <output>
    <soap:body use="literal"/>
  </output>
</operation>
<operation name="NumberToDollars">
  <soap:operation soapAction="" style="document"/>
  <input>
    <soap:body use="literal"/>
  </input>
  <output>
    <soap:body use="literal"/>
  </output>
</operation>
</binding>
<binding name="NumberConversionSoapBinding12" type="tns:NumberConversionSoapType">
<soap12:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
<operation name="NumberToWords">
  <soap12:operation soapAction="" style="document"/>
  <input>
    <soap12:body use="literal"/>
  </input>
  <output>
    <soap12:body use="literal"/>
  </output>
</operation>
<operation name="NumberToDollars">
  <soap12:operation soapAction="" style="document"/>
  <input>
    <soap12:body use="literal"/>
  </input>
  <output>
    <soap12:body use="literal"/>
  </output>
</operation>
</binding>
<service name="NumberConversion">
<documentation>The Number Conversion Web Service, implemented with Visual DataFlex, 
provides functions that convert numbers into words or dollar amounts.</documentation>
<port name="NumberConversionSoap" binding="tns:NumberConversionSoapBinding">
  <soap:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
</port>
<port name="NumberConversionSoap12" binding="tns:NumberConversionSoapBinding12">
  <soap12:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
</port>
</service>
</definitions>
`,
      parser = new Wsdl11Parser(),
      xmlParser = new XMLParser();
    let wsdlObject = new WsdlObject(),
      parsed = xmlParser.parseToObject(inputFile);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(4);

    expect(wsdlObject.operationsArray[0]).to.be.an('object')
      .and.to.include({
        name: 'NumberToWords',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap',
        serviceName: 'NumberConversion'
      });
    expect(wsdlObject.operationsArray[0].input).to.be.an('object');
    expect(wsdlObject.operationsArray[0].output).to.be.an('object');
    expect(wsdlObject.operationsArray[0].fault).to.be.an('object');

    expect(wsdlObject.operationsArray[0].description.replace(/[\r\n\s]+/g, '')).to.equal(
      ('Returns the word corresponding to the positive number ' +
        'passed as parameter. Limited to quadrillions.').replace(/[\r\n\s]+/g, ''));

    expect(wsdlObject.operationsArray[1]).to.be.an('object')
      .and.to.include({
        name: 'NumberToDollars',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap',
        serviceName: 'NumberConversion'
      });
    expect(wsdlObject.operationsArray[1].input).to.be.an('object');
    expect(wsdlObject.operationsArray[1].output).to.be.an('object');
    expect(wsdlObject.operationsArray[1].fault).to.be.null;

    expect(wsdlObject.operationsArray[2]).to.be.an('object')
      .and.to.include({
        name: 'NumberToWords',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap12',
        serviceName: 'NumberConversion'
      });

    expect(wsdlObject.operationsArray[3]).to.be.an('object')
      .and.to.include({
        name: 'NumberToDollars',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap12',
        serviceName: 'NumberConversion'
      });
  });

  it('should assign operations to wsdl object assignlocation correctly http', function () {
    const parser = new Wsdl11Parser(),
      xmlParser = new XMLParser();
    let wsdlObject = new WsdlObject(),
      parsed = xmlParser.parseToObject(TEMPERATURE_CONVERTER);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(6);

    expect(wsdlObject.operationsArray[0]).to.be.an('object')
      .and.to.include({
        name: 'FahrenheitToCelsius',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: 'http://www.w3schools.com/xml/tempconvert.asmx',
        portName: 'TempConvertSoap',
        serviceName: 'TempConvert'
      });

    expect(wsdlObject.operationsArray[1]).to.be.an('object')
      .and.to.include({
        name: 'CelsiusToFahrenheit',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: 'http://www.w3schools.com/xml/tempconvert.asmx',
        portName: 'TempConvertSoap',
        serviceName: 'TempConvert'
      });

    expect(wsdlObject.operationsArray[2]).to.be.an('object')
      .and.to.include({
        name: 'FahrenheitToCelsius',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: 'http://www.w3schools.com/xml/tempconvert.asmx',
        portName: 'TempConvertSoap12',
        serviceName: 'TempConvert'
      });

    expect(wsdlObject.operationsArray[3]).to.be.an('object')
      .and.to.include({
        name: 'CelsiusToFahrenheit',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: 'http://www.w3schools.com/xml/tempconvert.asmx',
        portName: 'TempConvertSoap12',
        serviceName: 'TempConvert'
      });
    expect(wsdlObject.operationsArray[4]).to.be.an('object')
      .and.to.include({
        name: 'FahrenheitToCelsius',
        method: POST_METHOD,
        protocol: HTTP_PROTOCOL,
        style: '',
        url: 'http://www.w3schools.com/xml/tempconvert.asmx/FahrenheitToCelsius',
        portName: 'TempConvertHttpPost',
        serviceName: 'TempConvert'
      });

    expect(wsdlObject.operationsArray[5]).to.be.an('object')
      .and.to.include({
        name: 'CelsiusToFahrenheit',
        method: POST_METHOD,
        protocol: HTTP_PROTOCOL,
        style: '',
        url: 'http://www.w3schools.com/xml/tempconvert.asmx/CelsiusToFahrenheit',
        portName: 'TempConvertHttpPost',
        serviceName: 'TempConvert'
      });
  });

  it('should assign operations to wsdl object when services is not in the file', function () {
    const parser = new Wsdl11Parser(),
      xmlParser = new XMLParser();
    fileContent = fs.readFileSync(specialCasesWSDLs + '/NoServicesTagNumberConvertion.wsdl', 'utf8');
    let wsdlObject = new WsdlObject(),
      parsed = xmlParser.parseToObject(fileContent);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(4);

    expect(wsdlObject.operationsArray[0]).to.be.an('object')
      .and.to.include({
        name: 'NumberToWords',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: '',
        portName: '',
        serviceName: ''
      });

    expect(wsdlObject.operationsArray[0].description.replace(/[\r\n\s]+/g, '')).to.equal(
      ('Returns the word corresponding to the positive number ' +
        'passed as parameter. Limited to quadrillions.').replace(/[\r\n\s]+/g, ''));

    expect(wsdlObject.operationsArray[1]).to.be.an('object')
      .and.to.include({
        name: 'NumberToDollars',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: '',
        portName: '',
        serviceName: ''
      });

    expect(wsdlObject.operationsArray[2]).to.be.an('object')
      .and.to.include({
        name: 'NumberToWords',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: '',
        portName: '',
        serviceName: ''
      });

    expect(wsdlObject.operationsArray[3]).to.be.an('object')
      .and.to.include({
        name: 'NumberToDollars',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: '',
        portName: '',
        serviceName: ''
      });
  });

  it('should assign operations empty object when bindings is not in the file', function () {
    const parser = new Wsdl11Parser(),
      xmlParser = new XMLParser();
    fileContent = fs.readFileSync(specialCasesWSDLs + '/NoBindingsTag.wsdl', 'utf8');
    let wsdlObject = new WsdlObject(),
      parsed = xmlParser.parseToObject(fileContent);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(0);
    expect(wsdlObject.log.errors.includes(DOC_HAS_NO_BINDIGS_MESSAGE))
      .to.equal(true);
  });

  it('should assign operations empty object when bindings operations are not in the file', function () {
    const parser = new Wsdl11Parser(),
      xmlParser = new XMLParser();
    fileContent = fs.readFileSync(specialCasesWSDLs + '/NoBindingsOperations.wsdl', 'utf8');
    let wsdlObject = new WsdlObject(),
      parsed = xmlParser.parseToObject(fileContent);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(0);
    expect(wsdlObject.log.errors.includes(DOC_HAS_NO_BINDIGS_OPERATIONS_MESSAGE))
      .to.equal(true);
  });

  it('should assign operations to wsdl object when services ports are not in the file', function () {
    const parser = new Wsdl11Parser(),
      xmlParser = new XMLParser();
    fileContent = fs.readFileSync(specialCasesWSDLs + '/NoServicesPortTag.wsdl', 'utf8');
    let wsdlObject = new WsdlObject(),
      parsed = xmlParser.parseToObject(fileContent);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(4);
    expect(wsdlObject.log.errors.includes(DOC_HAS_NO_SERVICE_PORT_MESSAGE))
      .to.equal(true);
    expect(wsdlObject.operationsArray[0]).to.be.an('object')
      .and.to.include({
        name: 'NumberToWords',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: '',
        portName: '',
        serviceName: ''
      });

    expect(wsdlObject.operationsArray[0].description.replace(/[\r\n\s]+/g, '')).to.equal(
      ('Returns the word corresponding to the positive number ' +
        'passed as parameter. Limited to quadrillions.').replace(/[\r\n\s]+/g, ''));

    expect(wsdlObject.operationsArray[1]).to.be.an('object')
      .and.to.include({
        name: 'NumberToDollars',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: '',
        portName: '',
        serviceName: ''
      });

    expect(wsdlObject.operationsArray[2]).to.be.an('object')
      .and.to.include({
        name: 'NumberToWords',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: '',
        portName: '',
        serviceName: ''
      });

    expect(wsdlObject.operationsArray[3]).to.be.an('object')
      .and.to.include({
        name: 'NumberToDollars',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: '',
        portName: '',
        serviceName: ''
      });
  });

  it('should assign operations to wsdl object when schema is not in the file', function () {
    const parser = new Wsdl11Parser(),
      xmlParser = new XMLParser();
    fileContent = fs.readFileSync(specialCasesWSDLs + '/NoSchema.wsdl', 'utf8');
    let wsdlObject = new WsdlObject(),
      parsed = xmlParser.parseToObject(fileContent);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(4);

    expect(wsdlObject.operationsArray[0]).to.be.an('object')
      .and.to.include({
        name: 'NumberToWords',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap',
        serviceName: 'NumberConversion'
      });

    expect(wsdlObject.operationsArray[0].description.replace(/[\r\n\s]+/g, '')).to.equal(
      ('Returns the word corresponding to the positive number ' +
        'passed as parameter. Limited to quadrillions.').replace(/[\r\n\s]+/g, ''));

    expect(wsdlObject.operationsArray[1]).to.be.an('object')
      .and.to.include({
        name: 'NumberToDollars',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap',
        serviceName: 'NumberConversion'
      });

    expect(wsdlObject.operationsArray[2]).to.be.an('object')
      .and.to.include({
        name: 'NumberToWords',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap12',
        serviceName: 'NumberConversion'
      });

    expect(wsdlObject.operationsArray[3]).to.be.an('object')
      .and.to.include({
        name: 'NumberToDollars',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap12',
        serviceName: 'NumberConversion'
      });
  });
});

describe('WSDL 1.1 parser getServiceAndServicePortByBindingName', function () {
  it('should get service by binding name', function () {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
     xmlns:xs="http://www.w3.org/2001/XMLSchema" 
     xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
     xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" 
    targetNamespace="http://www.dataaccess.com/webservicesserver/">
      <portType name="NumberConversionSoapType">
        <operation name="NumberToWords">
          <documentation>Returns the word corresponding to the positive number
           passed as parameter. Limited to quadrillions.</documentation>
          <input message="tns:NumberToWordsSoapRequest"/>
          <output message="tns:NumberToWordsSoapResponse"/>
        </operation>
        <operation name="NumberToDollars">
          <documentation>Returns the non-zero dollar amount of the passed number.</documentation>
          <input message="tns:NumberToDollarsSoapRequest"/>
          <output message="tns:NumberToDollarsSoapResponse"/>
        </operation>
      </portType>
      <binding name="NumberConversionSoapBinding" type="tns:NumberConversionSoapType">
        <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
        <operation name="NumberToWords">
          <soap:operation soapAction="" style="document"/>
          <input>
            <soap:body use="literal"/>
          </input>
          <output>
            <soap:body use="literal"/>
          </output>
        </operation>
        <operation name="NumberToDollars">
          <soap:operation soapAction="" style="document"/>
          <input>
            <soap:body use="literal"/>
          </input>
          <output>
            <soap:body use="literal"/>
          </output>
        </operation>
      </binding>
      <binding name="NumberConversionSoapBinding12" type="tns:NumberConversionSoapType">
        <soap12:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
        <operation name="NumberToWords">
          <soap12:operation soapAction="" style="document"/>
          <input>
            <soap12:body use="literal"/>
          </input>
          <output>
            <soap12:body use="literal"/>
          </output>
        </operation>
        <operation name="NumberToDollars">
          <soap12:operation soapAction="" style="document"/>
          <input>
            <soap12:body use="literal"/>
          </input>
          <output>
            <soap12:body use="literal"/>
          </output>
        </operation>
      </binding>
      <service name="NumberConversion">
        <documentation>The Number Conversion Web Service, implemented with Visual DataFlex,
         provides functions that convert numbers into words or dollar amounts.</documentation>
        <port name="NumberConversionSoap" binding="tns:NumberConversionSoapBinding">
          <soap:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
        </port>
        <port name="NumberConversionSoap12" binding="tns:NumberConversionSoapBinding12">
          <soap12:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
        </port>
      </service>
    </definitions>`,
      parser = new Wsdl11Parser(),
      xmlParser = new XMLParser();
    let parsed = xmlParser.parseToObject(simpleInput);
    services = getServices(parsed, WSDL_ROOT);
    service = parser.getServiceAndServicePortByBindingName('NumberConversionSoapBinding', services, '').service;
    expect(service).to.be.an('object');
    expect(service[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + 'name']).to.equal('NumberConversion');
  });


  it('should throw an error when binding name is null', function () {
    const parser = new Wsdl11Parser();
    try {
      parser.getServiceAndServicePortByBindingName(null, {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('BindingName must have a value');
    }
  });
  it('should throw an error when binding name is undefined', function () {
    const parser = new Wsdl11Parser();
    try {
      parser.getServiceAndServicePortByBindingName(undefined, {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('BindingName must have a value');
    }
  });
  it('should throw an error when binding name is an empty string', function () {
    const parser = new Wsdl11Parser();
    try {
      parser.getServiceAndServicePortByBindingName('', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('BindingName must have a value');
    }
  });

  it('should throw an error when PrincipalPrefix is undefined', function () {
    const parser = new Wsdl11Parser();
    try {
      parser.getServiceAndServicePortByBindingName('somename', {}, undefined);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('PrincipalPrefix must have a value');
    }
  });
  it('should throw an error when PrincipalPrefix is null', function () {
    const parser = new Wsdl11Parser();
    try {
      parser.getServiceAndServicePortByBindingName('somename', {}, null);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('PrincipalPrefix must have a value');
    }
  });

  it('should get undefined when services is null', function () {
    let wsdlObject = new WsdlObject(),
      parser = new Wsdl11Parser(),
      service = parser.getServiceAndServicePortByBindingName('somename', null, 'principal prefix', wsdlObject);
    expect(service).to.equal(undefined);
  });

  it('should get undefined when services is undefined', function () {
    let wsdlObject = new WsdlObject(),
      parser = new Wsdl11Parser(),
      service = parser.getServiceAndServicePortByBindingName('somename', undefined, 'principal prefix', wsdlObject);
    expect(service).to.equal(undefined);

  });

  it('should throw an error when services is an empty object', function () {
    let wsdlObject = new WsdlObject(),
      parser = new Wsdl11Parser(),
      service = parser.getServiceAndServicePortByBindingName('somename', {}, 'principal prefix', wsdlObject);
    expect(service).to.equal(undefined);
  });

});

describe('WSDL 1.1 parser getPortTypeOperationByPortTypeNameAndOperationName', function () {
  it('should get portType by name', function () {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
     xmlns:xs="http://www.w3.org/2001/XMLSchema" 
     xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
     xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" 
    targetNamespace="http://www.dataaccess.com/webservicesserver/">
      <portType name="NumberConversionSoapType">
        <operation name="NumberToWords">
          <documentation>Returns the word corresponding to the positive number
           passed as parameter. Limited to quadrillions.</documentation>
          <input message="tns:NumberToWordsSoapRequest"/>
          <output message="tns:NumberToWordsSoapResponse"/>
        </operation>
        <operation name="NumberToDollars">
          <documentation>Returns the non-zero dollar amount of the passed number.</documentation>
          <input message="tns:NumberToDollarsSoapRequest"/>
          <output message="tns:NumberToDollarsSoapResponse"/>
        </operation>
      </portType>
      <binding name="NumberConversionSoapBinding" type="tns:NumberConversionSoapType">
        <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
        <operation name="NumberToWords">
          <soap:operation soapAction="" style="document"/>
          <input>
            <soap:body use="literal"/>
          </input>
          <output>
            <soap:body use="literal"/>
          </output>
        </operation>
        <operation name="NumberToDollars">
          <soap:operation soapAction="" style="document"/>
          <input>
            <soap:body use="literal"/>
          </input>
          <output>
            <soap:body use="literal"/>
          </output>
        </operation>
      </binding>
      <binding name="NumberConversionSoapBinding12" type="tns:NumberConversionSoapType">
        <soap12:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
        <operation name="NumberToWords">
          <soap12:operation soapAction="" style="document"/>
          <input>
            <soap12:body use="literal"/>
          </input>
          <output>
            <soap12:body use="literal"/>
          </output>
        </operation>
        <operation name="NumberToDollars">
          <soap12:operation soapAction="" style="document"/>
          <input>
            <soap12:body use="literal"/>
          </input>
          <output>
            <soap12:body use="literal"/>
          </output>
        </operation>
      </binding>
      <service name="NumberConversion">
        <documentation>The Number Conversion Web Service, implemented with Visual DataFlex,
         provides functions that convert numbers into words or dollar amounts.</documentation>
        <port name="NumberConversionSoap" binding="tns:NumberConversionSoapBinding">
          <soap:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
        </port>
        <port name="NumberConversionSoap12" binding="tns:NumberConversionSoapBinding12">
          <soap12:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
        </port>
      </service>
    </definitions>`,
      parser = new Wsdl11Parser(),
      xmlParser = new XMLParser();
    let parsed = xmlParser.parseToObject(simpleInput);
    services = getServices(parsed, WSDL_ROOT);
    service = parser.getPortTypeOperationByPortTypeNameAndOperationName('NumberConversionSoapType',
      'NumberToWords', parsed, '');
    expect(service).to.be.an('object');
    expect(service[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + 'name']).to.equal('NumberToWords');
  });

  it('should throw an error when parsedxml is null', function () {
    try {
      const parser = new Wsdl11Parser();
      parser.getPortTypeOperationByPortTypeNameAndOperationName('NumberConversionSoapType',
        'NumberToWords', null, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get porttype from undefined or null object');
    }
  });

  it('should throw an error when parsedxml is undefined', function () {
    try {
      const parser = new Wsdl11Parser();
      parser.getPortTypeOperationByPortTypeNameAndOperationName('NumberConversionSoapType',
        'NumberToWords', undefined, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get porttype from undefined or null object');
    }
  });

  it('should throw an error when parsedxml is an empty object', function () {
    try {
      const parser = new Wsdl11Parser();
      parser.getPortTypeOperationByPortTypeNameAndOperationName('NumberConversionSoapType',
        'NumberToWords', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get port type from object');
    }
  });


  it('should throw an error when portTypeName is null', function () {
    try {
      const parser = new Wsdl11Parser();
      parser.getPortTypeOperationByPortTypeNameAndOperationName(null,
        'NumberToWords', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get port type with no filter name');
    }
  });

  it('should throw an error when portTypeName is undefined', function () {
    try {
      const parser = new Wsdl11Parser();
      parser.getPortTypeOperationByPortTypeNameAndOperationName(undefined,
        'NumberToWords', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get port type with no filter name');
    }
  });

  it('should throw an error when portTypeName is an empty string', function () {
    try {
      const parser = new Wsdl11Parser();
      parser.getPortTypeOperationByPortTypeNameAndOperationName('',
        'NumberToWords', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get port type with no filter name');
    }
  });

  it('should throw an error when operationName is null', function () {
    try {
      const parser = new Wsdl11Parser();
      parser.getPortTypeOperationByPortTypeNameAndOperationName('some string',
        null, {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get port type with no filter operationName');
    }
  });

  it('should throw an error when operationName is undefined', function () {
    try {
      const parser = new Wsdl11Parser();
      parser.getPortTypeOperationByPortTypeNameAndOperationName('some string',
        undefined, {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get port type with no filter operationName');
    }
  });

  it('should throw an error when operationName is an empty string', function () {
    try {
      const parser = new Wsdl11Parser();
      parser.getPortTypeOperationByPortTypeNameAndOperationName('ddd',
        '', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get port type with no filter operationName');
    }
  });

});

describe('WSDL 1.1 parser getWsdlObject', function () {

  it('should get an object in memory representing wsdlObject validate all namespaces found',
    function () {
      const parser = new Wsdl11Parser();
      let wsdlObject = parser.getWsdlObject(NUMBERCONVERSION_INPUT, new XMLParser());
      expect(wsdlObject).to.be.an('object');
      expect(wsdlObject).to.have.all.keys('targetNamespace',
        'wsdlNamespace', 'SOAPNamespace', 'HTTPNamespace',
        'SOAP12Namespace', 'schemaNamespace',
        'tnsNamespace', 'allNameSpaces', 'documentation', 'fileName', 'log',
        'operationsArray', 'securityPolicyArray',
        'securityPolicyNamespace', 'xmlParsed', 'version');

      expect(wsdlObject.allNameSpaces).to.be.an('array');
      expect(wsdlObject.allNameSpaces.length).to.equal(6);
      xmlns = wsdlObject.allNameSpaces.find((namespace) => {
        return namespace.url === WSDL_NS_URL;
      });
      expect(xmlns.isDefault).to.equal(true);
      // asserts on namespaces
      expect(wsdlObject.targetNamespace.url).to.equal('http://www.dataaccess.com/webservicesserver/');
      expect(wsdlObject.tnsNamespace.url).to.equal('http://www.dataaccess.com/webservicesserver/');
      expect(wsdlObject.wsdlNamespace.key).to.equal('xmlns');
      expect(wsdlObject.SOAPNamespace.key).to.equal('soap');
      expect(wsdlObject.SOAP12Namespace.key).to.equal('soap12');
      expect(wsdlObject.schemaNamespace.key).to.equal('xs');

      // asserts on operations
      expect(wsdlObject.operationsArray).to.be.an('array');
      expect(wsdlObject.operationsArray.length).to.equal(4);
      expect(wsdlObject.operationsArray[0]).to.be.an('object')
        .and.to.include({
          name: 'NumberToWords',
          method: POST_METHOD,
          protocol: SOAP_PROTOCOL,
          style: 'document',
          url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
          portName: 'NumberConversionSoap',
          serviceName: 'NumberConversion'
        });
      expect(wsdlObject.operationsArray[0].description).to.not.be.empty;

      expect(wsdlObject.operationsArray[1]).to.be.an('object')
        .and.to.include({
          name: 'NumberToDollars',
          method: POST_METHOD,
          protocol: SOAP_PROTOCOL,
          style: 'document',
          url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
          portName: 'NumberConversionSoap',
          serviceName: 'NumberConversion'
        });

      expect(wsdlObject.operationsArray[2]).to.be.an('object')
        .and.to.include({
          name: 'NumberToWords',
          method: POST_METHOD,
          protocol: SOAP12_PROTOCOL,
          style: 'document',
          url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
          portName: 'NumberConversionSoap12',
          serviceName: 'NumberConversion'
        });

      expect(wsdlObject.operationsArray[3]).to.be.an('object')
        .and.to.include({
          name: 'NumberToDollars',
          method: POST_METHOD,
          protocol: SOAP12_PROTOCOL,
          style: 'document',
          url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
          portName: 'NumberConversionSoap12',
          serviceName: 'NumberConversion'
        });

    });

  it('should throw an error when parsedxml is null', function () {
    try {
      const parser = new Wsdl11Parser();
      parser.getWsdlObject(null);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('xmlDocumentContent must have a value');
    }
  });
});
