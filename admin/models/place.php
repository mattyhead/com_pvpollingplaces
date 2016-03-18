<?php
/**
 * Places Model for Pvpollingplaces Component
 *
 * @package    Philadelphia.Votes
 * @subpackage Components
 * @license        GNU/GPL
 */

// No direct access
defined('_JEXEC') or die('Restricted access');

jimport('joomla.application.component.model');

/**
 * Place Model
 *
 * @package    Philadelphia.Votes
 * @subpackage Components
 */
class PvpollingplacesModelPlace extends JModel
{
    /**
     * Constructor that retrieves the ID from the request
     *
     * @access    public
     * @return    void
     */
    public function __construct()
    {
        parent::__construct();

        $array = JRequest::getVar('cid', 0, '', 'array');
        $id = JRequest::getInt('id');
        if ($id) {
            // in case we're updating and check() failed
            $this->setId((int) $id);
        } else {
            $this->setId((int) $array[0]);
        }
    }

    /**
     * Method to set the applicant identifier
     *
     * @access    public
     * @param    int applicant identifier
     * @return    void
     */
    public function setId($id)
    {
        // Set id and wipe data
        $this->_id = $id;
        $this->_data = null;
    }

    /**
     * Method to get an applicant
     *
     * @return object with data
     */
    public function &getData()
    {
        // Load the data
        if (empty($this->_data)) {
            $query = ' SELECT * FROM #__pollingplaces ' .
            '  WHERE id = ' . $this->_db->quote($this->_id);
            $this->_db->setQuery($query);
            $this->_data = $this->_db->loadObject();
        }
        if (!$this->_data) {
            $this->_data = new stdClass();
            $this->_data->id = 0;
            $this->_data->greeting = null;
        }
        return $this->_data;
    }

    /**
     * Method to store a record
     *
     * @access    public
     * @return    boolean    True on success
     */
    public function store()
    {
        $row = &$this->getTable();

        $data = JRequest::get('post');

        // Bind the form fields to the place table
        if (!$row->bind($data)) {
            $this->setError($this->_db->getErrorMsg());
            return false;
        }

        // Make sure the Pvpollingplace record is valid
        if (!$row->check()) {
            //$this->setError($this->_db->getErrorMsg());
            foreach ($row->getErrors() as $msg) {
                $this->setError($msg);
            }
            return false;
        }

        // Store the web link table to the database
        if (!$row->store()) {
            $this->setError($row->getErrorMsg());
            return false;
        }

        return true;
    }

    /**
     * Method to delete record(s)
     *
     * @access    public
     * @return    boolean    True on success
     */
    public function delete()
    {
        $cids = JRequest::getVar('cid', array(0), 'post', 'array');

        $row = &$this->getTable();

        if (count($cids)) {
            foreach ($cids as $cid) {
                if (!$row->delete($cid)) {
                    $this->setError($row->getErrorMsg());
                    return false;
                }
            }
        }
        return true;
    }
}
